import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Upload, X } from 'lucide-react';
import { listUploads, removeUpload, renameUpload, saveUpload, UploadedStyle } from '@/utils/localImageLibrary';

interface Style {
  id: string;
  name: string;
  previewImage: string;
}

interface StyleGroup {
  groupName: string;
  styles: Style[];
}

interface StylePickerProps {
  styleGroups: StyleGroup[];
  onSelect: (style: Style) => void;
  onClose: () => void;
  title: string;
  category: string;
}

const StylePicker: React.FC<StylePickerProps> = ({ styleGroups, onSelect, onClose, title, category }) => {
  const [uploads, setUploads] = useState<UploadedStyle[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    listUploads(category).then(items => { if (active) setUploads(items); })
      .catch(() => { if (active) setError('无法读取本机图片，请检查浏览器存储权限。'); });
    return () => { active = false; };
  }, [category]);
  const upload = async (file: File) => {
    setBusy(true);
    setError('');
    try {
      await saveUpload(file, category);
      setUploads(await listUploads(category));
    } catch (err) { setError(err instanceof Error ? err.message : '保存图片失败'); }
    finally { setBusy(false); }
  };
  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-3/4 max-h-[80vh]">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button type="button" onClick={onClose} title="关闭" aria-label="关闭" className="p-2 text-gray-500 hover:text-gray-800"><X size={20}/></button>
        </div>
        <div className="overflow-y-auto max-h-[calc(80vh-100px)] p-2">
          {styleGroups.map(group => (
            <div key={group.groupName}>
              <h4 className="text-md font-bold mt-4 mb-2 pl-2 text-gray-600">{group.groupName}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {group.styles.map(style => (
                  <div 
                    key={style.id} 
                    className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-xl hover:border-blue-500 transition-all duration-200 group"
                    onClick={() => {
                      onSelect(style);
                      onClose();
                    }}
                  >
                    <div className="h-40 bg-gray-200 flex items-center justify-center">
                      <img src={style.previewImage} alt={style.name} className="max-h-full max-w-full object-contain"/>
                    </div>
                    <div className="p-2 bg-gray-50 group-hover:bg-blue-500 group-hover:text-white">
                      <p className="text-sm font-semibold text-center">{style.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <section className="mt-6 border-t pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h4 className="font-bold text-gray-600">我的上传 · 本机</h4>
              <label className="inline-flex items-center gap-2 p-2 border rounded cursor-pointer">
                <Upload size={16}/>{busy ? '保存中…' : '上传图片'}
                <input aria-label="上传款式图片" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} className="sr-only" onChange={event => {
                  const file = event.target.files?.[0];
                  event.target.value = '';
                  if (file) void upload(file);
                }}/>
              </label>
            </div>
            {error && <p role="alert" className="text-sm text-red-600 mb-2">{error}</p>}
            {!uploads.length && <p className="text-sm text-gray-500">暂无上传图片</p>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {uploads.map(item => <div key={item.id} className="border rounded-lg overflow-hidden">
                <button type="button" aria-label={item.name} className="w-full text-left hover:bg-gray-50" onClick={() => { onSelect(item); onClose(); }}>
                  <div className="h-40 bg-gray-100 flex items-center justify-center"><img src={item.previewImage} alt={item.name} className="max-h-full max-w-full object-contain"/></div>
                  <p className="p-2 text-sm font-semibold break-words">{item.name}</p>
                </button>
                <div className="flex justify-end border-t">
                  <button type="button" title="重命名" aria-label={`重命名 ${item.name}`} className="p-3" onClick={async () => {
                    const name = window.prompt('款式名称', item.name)?.trim();
                    if (!name) return;
                    try { await renameUpload(item, name); setUploads(await listUploads(category)); }
                    catch { setError('重命名失败，请重试。'); }
                  }}><Pencil size={16}/></button>
                  <button type="button" title="从我的上传移除" aria-label={`移除 ${item.name}`} className="p-3 text-red-600" onClick={async () => {
                    if (!window.confirm('从我的上传移除？已保存报价中的图片不会受影响。')) return;
                    try { await removeUpload(item.id); setUploads(await listUploads(category)); }
                    catch { setError('移除失败，请重试。'); }
                  }}><Trash2 size={16}/></button>
                </div>
              </div>)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StylePicker;
