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
import {
  escalatorTranslations,
  translateEscalatorSpecLabel,
  translateEscalatorValue,
} from '@/data/escalatorTranslations';
import { Lang } from '@/data/translations';

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
  language: Lang;
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
  const et = escalatorTranslations[state.language] || escalatorTranslations.en;

  const children: (Paragraph | Table)[] = [
    para(et.quotation, { bold: true, size: 32, align: AlignmentType.CENTER }),
    para(et.intro),
    para(`${et.customer}: ${state.customer}        ${et.term}: ${state.quotationType}`, { bold: true }),
    para(`${et.quotationNo}: ${state.quotationNo}        ${et.project}: ${state.projectName}`),
    para(`${et.date}: ${state.quotationDate}`),
    para(et.productPrice, { bold: true, size: 22 }),
  ];

  const priceWidths = [820, 2600, 900, 1000, 900, 1300, 1840];
  children.push(
    table(
      [
        new TableRow({
          children: [et.liftNo, et.description, et.speed, et.inclination, et.quantity, et.unitPrice, et.totalPrice].map((h, i) =>
            cell(h, { width: priceWidths[i], bold: true, bg: 'EDEDED' }),
          ),
        }),
        ...state.priceRows.map((row) =>
          isPriceExtraRow(row)
            ? new TableRow({
              children: [
                cell(row.liftNo),
                cell(translateEscalatorValue(row.description, state.language), { colSpan: 3, align: AlignmentType.LEFT }),
                cell(row.quantity),
                cell(money(row.unitPrice)),
                cell(money(Number(row.quantity || 0) * Number(row.unitPrice || 0))),
              ],
            })
            : new TableRow({
              children: [
                cell(row.liftNo),
                cell(translateEscalatorValue(row.description, state.language), { align: AlignmentType.LEFT }),
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
                cell(et.freight(state.freightDestination), {
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
            cell(et.total(state.quotationType, !isExw ? state.freightDestination : ''), {
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
    para(et.exchangeNote(state.exchangeRateBasis)),
    para(et.installNote),
    para(et.validityNote(state.validityDays)),
    para(et.containersNote(state.containerEstimate)),
    para(et.paymentTerm, { bold: true, size: 22 }),
    para(state.paymentTerm),
    para(et.deliveryDate, { bold: true, size: 22 }),
    para(et.deliveryText(state.deliveryDays)),
    para(et.warrantyPeriod, { bold: true, size: 22 }),
    para(et.warrantyText(state.warrantyMonths)),
    para(et.specification, { bold: true, size: 24, align: AlignmentType.CENTER }),
  );

  const specWidths = [3000, ...state.specGroups.map(() => Math.floor(6360 / state.specGroups.length))];
  children.push(
    table(
      [
        new TableRow({
          children: [
            cell(et.specificationHeader, { bold: true, bg: 'D9EAF7', width: specWidths[0] }),
            ...state.specGroups.map((group, index) =>
              cell(group.no || `E${index + 1}`, { bold: true, bg: 'D9EAF7', width: specWidths[index + 1] }),
            ),
          ],
        }),
        ...escalatorSpecRows.map(
          (row) =>
            new TableRow({
              children: [
                cell(translateEscalatorSpecLabel(row.label, row.key, state.language), { align: AlignmentType.LEFT }),
                ...state.specGroups.map((group) => cell(translateEscalatorValue(String(group[row.key] ?? ''), state.language))),
              ],
            }),
        ),
      ],
      specWidths,
    ),
  );

  children.push(para(et.configuration, { bold: true, size: 24, align: AlignmentType.CENTER }));
  const configWidths = [700, 3800, 2200, 2660];
  children.push(
    table(
      [
        new TableRow({
          children: [et.configNo, et.configName, et.configBrand, et.configRemarks].map((h, i) =>
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

  children.push(para(et.functionDescription, { bold: true, size: 24, align: AlignmentType.CENTER }));
  const functionWidths = [700, 3000, 5660];
  children.push(
    table(
      [
        new TableRow({
          children: [et.functionNo, et.functionName, et.functionText].map((h, i) =>
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
    para(et.finalNote),
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
