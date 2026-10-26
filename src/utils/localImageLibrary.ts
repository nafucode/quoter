export interface UploadedStyle {
  id: string;
  name: string;
  category: string;
  previewImage: string;
  createdAt: number;
}

export const imageCategory = (field: string) =>
  /^cabin(?:Image)?[23]?$/.test(field) ? 'cabin' : field.replace(/Image$/, '');

async function database() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('quoter-local-data', 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('uploads', { keyPath: 'id' });
      request.result.createObjectStore('records');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('请关闭其他 Quoter 窗口后重试。'));
  });
}

async function transaction<T>(store: string, mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const request = action(tx.objectStore(store));
    tx.oncomplete = () => { db.close(); resolve(request.result); };
    tx.onabort = () => { db.close(); reject(tx.error || request.error || new Error('本机存储失败')); };
    tx.onerror = () => { /* onabort reports the transaction failure. */ };
  });
}

// Keep existing localStorage records as a migration backup; new writes use IndexedDB.
export const quoteStorage = {
  async getItem(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    const value = await transaction<string | undefined>('records', 'readonly', store => store.get(key));
    if (value !== undefined) return value;
    const legacy = localStorage.getItem(key);
    if (legacy !== null) await quoteStorage.setItem(key, legacy);
    return legacy;
  },
  async setItem(key: string, value: string) {
    await transaction('records', 'readwrite', store => store.put(value, key));
  },
  async removeItem(key: string) {
    // A tombstone prevents deleted history being restored from the migration backup.
    await quoteStorage.setItem(key, '[]');
  },
};

let draftReadFailed = false;
export const hasDraftReadError = () => draftReadFailed;
export const draftStorage = {
  ...quoteStorage,
  async getItem(key: string) {
    try { return await quoteStorage.getItem(key); }
    catch (error) {
      draftReadFailed = true;
      window.dispatchEvent(new Event('quoter-storage-error'));
      throw error;
    }
  },
  async setItem(key: string, value: string) {
    try { await quoteStorage.setItem(key, value); }
    catch {
      window.dispatchEvent(new Event('quoter-storage-error'));
    }
  },
};

export async function listUploads(category: string) {
  const records = await transaction<UploadedStyle[]>('uploads', 'readonly', store => store.getAll());
  return records.filter(item => item.category === imageCategory(category)).sort((a, b) => b.createdAt - a.createdAt);
}

export async function removeUpload(id: string) {
  await transaction('uploads', 'readwrite', store => store.delete(id));
}

export async function renameUpload(item: UploadedStyle, name: string) {
  await transaction('uploads', 'readwrite', store => store.put({ ...item, name }));
}

export async function saveUpload(file: File, category: string): Promise<UploadedStyle> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('请选择 JPG、PNG 或 WebP 图片。');
  if (file.size > 20 * 1024 * 1024) throw new Error('图片不能超过 20 MB。');
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext('2d');
  if (!context) { bitmap.close(); throw new Error('无法处理图片，请换一张图片重试。'); }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const item: UploadedStyle = {
    id: `upload-${crypto.randomUUID()}`,
    name: file.name.replace(/\.[^.]+$/, ''),
    category: imageCategory(category),
    previewImage: canvas.toDataURL(file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png', 0.9),
    createdAt: Date.now(),
  };
  await transaction('uploads', 'readwrite', store => store.put(item));
  return item;
}
