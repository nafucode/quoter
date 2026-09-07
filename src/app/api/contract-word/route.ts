import htmlToDocx from 'html-to-docx';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const { html, title } = await request.json();
  if (typeof html !== 'string' || !html.trim()) {
    return Response.json({ error: 'Missing contract HTML.' }, { status: 400 });
  }
  if (html.length > 30_000_000) {
    return Response.json({ error: 'Contract document is too large.' }, { status: 413 });
  }

  const output = await htmlToDocx(html, null, {
    pageSize: { width: 11906, height: 16838 },
    margins: { top: 567, right: 567, bottom: 567, left: 567 },
    title: typeof title === 'string' ? title : 'Sales Contract',
    creator: 'Suzhou Xinfuji Electromechanical Co., Ltd.',
    font: 'Arial',
    fontSize: '9pt',
    table: { row: { cantSplit: true } },
    decodeUnicode: true,
    lang: 'en-US',
  });
  const bytes = output instanceof Blob
    ? new Uint8Array(await output.arrayBuffer())
    : new Uint8Array(output);

  return new Response(bytes, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="sales-contract.docx"',
      'Cache-Control': 'no-store',
    },
  });
}
