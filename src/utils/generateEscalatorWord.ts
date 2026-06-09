import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import {
  escalatorSpecRows,
  EscalatorConfigRow,
  EscalatorFunctionRow,
  EscalatorPriceRow,
  EscalatorSpecGroup,
} from '@/data/escalatorDefaults';

export type EscalatorQuoteWordState = {
  customer: string;
  quotationNo: string;
  projectName: string;
  quotationType: string;
  quotationDate: string;
  paymentTerm: string;
  deliveryDays: number;
  validityDays: number;
  warrantyMonths: number;
  exchangeRateBasis: number;
  containerEstimate: string;
  freightDestination: string;
  freightCost: number;
  priceRows: EscalatorPriceRow[];
  specGroups: EscalatorSpecGroup[];
  configRows: EscalatorConfigRow[];
  functionRows: EscalatorFunctionRow[];
};

const BORDER = { style: BorderStyle.SINGLE, size: 1, color: '888888' } as const;
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };

const money = (value: number) =>
  `$ ${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
const isPriceExtraRow = (row: EscalatorPriceRow) => !row.speed && !row.inclination;

const text = (value: string | number, opts: { bold?: boolean; size?: number } = {}) =>
  new TextRun({
    text: String(value ?? ''),
    bold: opts.bold,
    size: opts.size ?? 18,
    font: 'Arial',
  });

const para = (
  value: string | TextRun[],
  opts: { bold?: boolean; align?: (typeof AlignmentType)[keyof typeof AlignmentType]; size?: number } = {},
) =>
  new Paragraph({
    alignment: opts.align,
    spacing: { after: 80 },
    children: Array.isArray(value) ? value : [text(value, { bold: opts.bold, size: opts.size })],
  });

const cell = (
  value: string | number | TextRun[],
  opts: {
    width?: number;
    bold?: boolean;
    bg?: string;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    colSpan?: number;
  } = {},
) =>
  new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    columnSpan: opts.colSpan,
    shading: opts.bg ? { fill: opts.bg } : undefined,
    borders: BORDERS,
    margins: { top: 80, bottom: 80, left: 90, right: 90 },
    children: [
      new Paragraph({
        alignment: opts.align ?? AlignmentType.CENTER,
        spacing: { after: 0 },
        children: Array.isArray(value) ? value : [text(value, { bold: opts.bold })],
      }),
    ],
  });

const table = (rows: TableRow[], widths: number[]) =>
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: widths,
    rows,
  });

export async function generateEscalatorWordBlob(state: EscalatorQuoteWordState) {
  const priceTotal = state.priceRows.reduce(
    (sum, row) => sum + Number(row.quantity || 0) * Number(row.unitPrice || 0),
    0,
  );
  const isExw = state.quotationType === 'EXW';
  const grandTotal = priceTotal + (isExw ? 0 : Number(state.freightCost || 0));

  const children: (Paragraph | Table)[] = [
    para('Quotation', { bold: true, size: 32, align: AlignmentType.CENTER }),
    para(
      'We thank you very much for your enquiry. In the meantime, should you have any questions, please do not hesitate to contact us. We refer to the above mention project and would like to submit our price to you.',
    ),
    para(`Customer: ${state.customer}        Term: ${state.quotationType}`, { bold: true }),
    para(`Quotation No.: ${state.quotationNo}        Project: ${state.projectName}`),
    para(`Quotation Date: ${state.quotationDate}`),
    para('I. Product & Price', { bold: true, size: 22 }),
  ];

  const priceWidths = [820, 2600, 900, 1000, 900, 1300, 1840];
  children.push(
    table(
      [
        new TableRow({
          children: ['Lift NO.', 'Description', 'Speed / (m/s)', 'Inclination / (°)', 'Quantity (Unit)', 'Unit Price ($)', 'Total Price ($)'].map((h, i) =>
            cell(h, { width: priceWidths[i], bold: true, bg: 'EDEDED' }),
          ),
        }),
        ...state.priceRows.map((row) =>
          isPriceExtraRow(row)
            ? new TableRow({
              children: [
                cell(row.liftNo),
                cell(row.description, { colSpan: 3, align: AlignmentType.LEFT }),
                cell(row.quantity),
                cell(money(row.unitPrice)),
                cell(money(Number(row.quantity || 0) * Number(row.unitPrice || 0))),
              ],
            })
            : new TableRow({
              children: [
                cell(row.liftNo),
                cell(row.description, { align: AlignmentType.LEFT }),
                cell(row.speed),
                cell(row.inclination),
                cell(row.quantity),
                cell(money(row.unitPrice)),
                cell(money(Number(row.quantity || 0) * Number(row.unitPrice || 0))),
              ],
            }),
        ),
        ...(!isExw
          ? [
            new TableRow({
              children: [
                cell(`Local freight container from factory to ${state.freightDestination} :`, {
                  colSpan: 6,
                  align: AlignmentType.RIGHT,
                }),
                cell(money(state.freightCost)),
              ],
            }),
          ]
          : []),
        new TableRow({
          children: [
            cell(`Total ${state.quotationType}${!isExw ? ` ${state.freightDestination}` : ''}`, {
              colSpan: 6,
              bold: true,
              align: AlignmentType.RIGHT,
              bg: 'FFF2CC',
            }),
            cell(money(grandTotal), { bold: true, bg: 'FFF2CC' }),
          ],
        }),
      ],
      priceWidths,
    ),
  );

  children.push(
    para(`Note: (1) Price refer to exchange 1 USD=${state.exchangeRateBasis} RMB, in case the exchange rate fluctuates over ±2%, when sign the contract, the price will be adjusted accordingly.`),
    para('(2) Installation & commission & certificate cost is not included.'),
    para(`(3) Quotation valid period: ${state.validityDays} days`),
    para(`(4) Total need ${state.containerEstimate} containers estimate.`),
    para('II. Payment term', { bold: true, size: 22 }),
    para(state.paymentTerm),
    para('III. Delivery date', { bold: true, size: 22 }),
    para(`${state.deliveryDays} days after both parties confirmed the detailed builder's work drawing, signed the commodity contract and received prepayment.`),
    para('IV. Warranty period', { bold: true, size: 22 }),
    para(`${state.warrantyMonths} months after shipping date. (Core components)`),
    para('Specification', { bold: true, size: 24, align: AlignmentType.CENTER }),
  );

  const specWidths = [3000, ...state.specGroups.map(() => Math.floor(6360 / state.specGroups.length))];
  children.push(
    table(
      [
        new TableRow({
          children: [
            cell('参数 Specification', { bold: true, bg: 'D9EAF7', width: specWidths[0] }),
            ...state.specGroups.map((group, index) =>
              cell(group.no || `E${index + 1}`, { bold: true, bg: 'D9EAF7', width: specWidths[index + 1] }),
            ),
          ],
        }),
        ...escalatorSpecRows.map(
          (row) =>
            new TableRow({
              children: [
                cell(row.label, { align: AlignmentType.LEFT }),
                ...state.specGroups.map((group) => cell(String(group[row.key] ?? ''))),
              ],
            }),
        ),
      ],
      specWidths,
    ),
  );

  children.push(para('主要配置表 / Main Configuration', { bold: true, size: 24, align: AlignmentType.CENTER }));
  const configWidths = [700, 3800, 2200, 2660];
  children.push(
    table(
      [
        new TableRow({
          children: ['序号 NO.', '名称 Name', '品牌 Brand', '备注 Remarks'].map((h, i) =>
            cell(h, { bold: true, bg: 'EDEDED', width: configWidths[i] }),
          ),
        }),
        ...state.configRows.map(
          (row) =>
            new TableRow({
              children: [
                cell(row.no, { bold: row.section, bg: row.section ? 'F5F5F5' : undefined }),
                cell(row.name, { bold: row.section, bg: row.section ? 'F5F5F5' : undefined, align: AlignmentType.LEFT }),
                cell(row.brand, { bold: row.section, bg: row.section ? 'F5F5F5' : undefined }),
                cell(row.remarks, { bold: row.section, bg: row.section ? 'F5F5F5' : undefined, align: AlignmentType.LEFT }),
              ],
            }),
        ),
      ],
      configWidths,
    ),
  );

  children.push(para('Main Function Description', { bold: true, size: 24, align: AlignmentType.CENTER }));
  const functionWidths = [700, 3000, 5660];
  children.push(
    table(
      [
        new TableRow({
          children: ['序号 (No.)', '功能名称 (Function Name)', '功能说明 (Function Description)'].map((h, i) =>
            cell(h, { bold: true, bg: 'EDEDED', width: functionWidths[i] }),
          ),
        }),
        ...state.functionRows.map(
          (row) =>
            new TableRow({
              children: [
                cell(row.no),
                cell(row.name, { align: AlignmentType.LEFT }),
                cell(row.description, { align: AlignmentType.LEFT }),
              ],
            }),
        ),
      ],
      functionWidths,
    ),
  );

  children.push(
    para(
      'Note: In order to further improve product quality and promote technological innovation, and to better meet customer needs, our company reserves the right to modify the configuration and brand of certain components mentioned above. However, we guarantee that the quality of any updated components will be no lower than that of the original ones.',
    ),
  );

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}
