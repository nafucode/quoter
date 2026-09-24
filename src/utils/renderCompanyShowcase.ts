import { getCompanyShowcaseContent } from '@/data/companyShowcase';
import type { Lang } from '@/data/translations';

const cache = new Map<Lang, Promise<string>>();

// Render once at a fixed A4 aspect ratio, independent of viewport and print CSS.
export function renderCompanyShowcase(language: Lang): Promise<string> {
  const existing = cache.get(language);
  if (existing) return existing;
  const rendering = (async () => {
    await document.fonts.ready;
    const content = getCompanyShowcaseContent(language);
    const images = await Promise.all(content.sections.flatMap(section => section.images).map(async ([src]) => {
      const image = new Image();
      image.src = src;
      await image.decode();
      return image;
    }));
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 2263;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const margin = 40;
    const width = canvas.width - margin * 2;

    function text(value: string, x: number, y: number, maxWidth: number, size: number, color: string, centered = false) {
      ctx!.font = `600 ${size}px Arial, sans-serif`;
      ctx!.fillStyle = color;
      ctx!.textAlign = centered ? 'center' : 'left';
      ctx!.textBaseline = 'top';
      const lines: string[] = [];
      let line = '';
      for (const word of value.split(/(?<=\s)|(?=[\u4e00-\u9fff])/u)) {
        if (line && ctx!.measureText(line + word).width > maxWidth) {
          lines.push(line.trim());
          line = word;
        } else line += word;
      }
      if (line) lines.push(line.trim());
      for (const [index, item] of lines.entries()) ctx!.fillText(item, x, y + index * size * 1.3, maxWidth);
      return lines.length * size * 1.3;
    }

    text('XINFUJI ELEVATOR & ESCALATOR', margin, 40, width, 21, '#976d2c');
    const headingHeight = text(content.heading, margin, 78, width, 43, '#173f75');
    let y = 78 + headingHeight + 18;
    ctx.fillStyle = '#173f75';
    ctx.fillRect(margin, y, width, 5);
    y += 26;
    let imageIndex = 0;
    for (const section of content.sections) {
      const titleHeight = text(`${section.number}  ${section.title}`, margin, y, width, 25, '#173f75');
      y += titleHeight + 14;
      for (let start = 0; start < section.images.length; start += 3) {
        const row = section.images.slice(start, start + 3);
        const gap = 16;
        const cellWidth = (width - gap * (row.length - 1)) / row.length;
        const isLastProjectRow = section.number === '03' && start + row.length === section.images.length;
        // Use the remaining page space for the two wide project photos, reserving room for captions.
        const imageHeight = isLastProjectRow ? Math.min(310, canvas.height - y - 120) : 195;
        let captionHeight = 0;
        for (const [column, [, caption]] of row.entries()) {
          const image = images[imageIndex++];
          const x = margin + column * (cellWidth + gap);
          // Apply the intended cover crop once; PDF prints the finished page unchanged.
          const scale = Math.max(cellWidth / image.naturalWidth, imageHeight / image.naturalHeight);
          const sourceWidth = cellWidth / scale;
          const sourceHeight = imageHeight / scale;
          ctx.drawImage(image,
            (image.naturalWidth - sourceWidth) / 2, (image.naturalHeight - sourceHeight) / 2,
            sourceWidth, sourceHeight, x, y, cellWidth, imageHeight);
          captionHeight = Math.max(captionHeight, text(caption, x + cellWidth / 2, y + imageHeight + 10, cellWidth - 12, 20, '#475569', true));
        }
        y += imageHeight + 10 + Math.max(32, captionHeight) + 10;
      }
      y += 12;
    }
    if (y > canvas.height - 24) throw new Error('Showcase content exceeds one page');
    return canvas.toDataURL('image/png');
  })();
  cache.set(language, rendering);
  rendering.catch(() => cache.delete(language));
  return rendering;
}
