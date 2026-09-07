declare module 'html-to-docx' {
  type HtmlToDocxOptions = {
    orientation?: 'portrait' | 'landscape';
    pageSize?: { width?: number | string; height?: number | string };
    margins?: Record<string, number | string>;
    title?: string;
    creator?: string;
    font?: string;
    fontSize?: number | string;
    table?: { row?: { cantSplit?: boolean } };
    decodeUnicode?: boolean;
    lang?: string;
  };

  export default function htmlToDocx(
    html: string,
    headerHtml?: string | null,
    options?: HtmlToDocxOptions,
    footerHtml?: string | null,
  ): Promise<Buffer | Blob>;
}
