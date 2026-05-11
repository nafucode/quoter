import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlignTable,
  PageBreak,
} from 'docx';
import { translations, Lang } from '@/data/translations';
import { PartListRow } from '@/data/partListDefaults';

// ─── helpers ────────────────────────────────────────────────────────────────

const BORDER = { style: BorderStyle.SINGLE, size: 1, color: '999999' } as const;
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' } as const;
const NO_BORDERS = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER };

// A4 content width in DXA with 1.5 cm margins: 11906 - 2 * 1701 = 8504
const PAGE_WIDTH = 11906;
const MARGIN = 1134; // ~2 cm
const CONTENT_W = PAGE_WIDTH - MARGIN * 2; // ≈ 9638 DXA

const bold = (text: string, size = 20) =>
  new TextRun({ text, bold: true, size, font: 'Arial' });
const plain = (text: string, size = 20) =>
  new TextRun({ text, size, font: 'Arial' });

const para = (
  children: TextRun[],
  opts: { align?: (typeof AlignmentType)[keyof typeof AlignmentType]; spacingAfter?: number } = {},
) =>
  new Paragraph({
    children,
    alignment: opts.align,
    spacing: { after: opts.spacingAfter ?? 80 },
  });

const cell = (
  content: string | TextRun[],
  opts: {
    bold?: boolean;
    bg?: string;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    width?: number;
    colSpan?: number;
    verticalAlign?: (typeof VerticalAlignTable)[keyof typeof VerticalAlignTable];
  } = {},
) => {
  const textRuns =
    typeof content === 'string'
      ? [new TextRun({ text: content, bold: opts.bold, size: 18, font: 'Arial' })]
      : content;

  return new TableCell({
    borders: BORDERS,
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    columnSpan: opts.colSpan,
    verticalAlign: opts.verticalAlign ?? VerticalAlignTable.CENTER,
    shading: opts.bg ? { fill: opts.bg, type: ShadingType.CLEAR } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [
      new Paragraph({
        children: textRuns,
        alignment: opts.align ?? AlignmentType.LEFT,
        spacing: { after: 0 },
      }),
    ],
  });
};

const headerRow = (cells: { text: string; width: number }[]) =>
  new TableRow({
    tableHeader: true,
    children: cells.map((c) =>
      cell(c.text, { bold: true, bg: 'D9D9D9', width: c.width, align: AlignmentType.CENTER }),
    ),
  });

// ─── main export ────────────────────────────────────────────────────────────

export async function generateWordBlob(state: {
  companyName: string;
  quotationNo: string;
  projectName: string;
  quotationType: string;
  quotationDate: string;
  elevators: any[];
  freightDestination: string;
  freightCost: number;
  exchangeRate: number;
  targetCurrency: string;
  deliveryDays: number;
  paymentTerm: string;
  warrantyMonths: number;
  priceValidityDays: number;
  shaftFrame: { enabled: boolean; text: string; price: number };
  temperedGlass: { enabled: boolean; text: string; price: number };
  partList: PartListRow[];
  language: Lang;
}): Promise<Blob> {
  const t = translations[state.language];

  // ── computed totals ──────────────────────────────────────────────────────
  const elevatorsTotal = state.elevators.reduce(
    (s, e) => s + (Number(e.unitPrice) || 0) * (Number(e.qty) || 0),
    0,
  );
  const optionals =
    (state.shaftFrame.enabled ? Number(state.shaftFrame.price) : 0) +
    (state.temperedGlass.enabled ? Number(state.temperedGlass.price) : 0);
  const grandTotal = elevatorsTotal + Number(state.freightCost) + optionals;
  const validUntil = (() => {
    try {
      const d = new Date(state.quotationDate);
      if (isNaN(d.getTime())) return '';
      d.setDate(d.getDate() + Number(state.priceValidityDays));
      return d.toLocaleDateString('en-CA');
    } catch {
      return '';
    }
  })();

  // ── sections ─────────────────────────────────────────────────────────────
  const children: (Paragraph | Table)[] = [];

  // === HEADER ===
  children.push(
    para([bold(`${t.quotation}`, 32)], { align: AlignmentType.CENTER, spacingAfter: 120 }),
  );

  // Info table (2-col)
  const infoColW = Math.floor(CONTENT_W / 2);
  children.push(
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [infoColW, CONTENT_W - infoColW],
      borders: NO_BORDERS,
      rows: [
        new TableRow({
          children: [
            cell([bold(`${t.company}: `, 20), plain(state.companyName, 20)], {
              width: infoColW,
            }),
            cell([bold(`${t.quotationNo}: `, 20), plain(state.quotationNo, 20)], {
              width: CONTENT_W - infoColW,
            }),
          ],
        }),
        new TableRow({
          children: [
            cell([bold(`${t.projectName}: `, 20), plain(state.projectName, 20)], {
              width: infoColW,
            }),
            cell([bold(`${t.quotationType}: `, 20), plain(state.quotationType, 20)], {
              width: CONTENT_W - infoColW,
            }),
          ],
        }),
      ],
    }),
  );
  children.push(para([], { spacingAfter: 200 }));

  // === PRICE TABLE ===
  children.push(para([bold(t.priceTitle, 22)], { spacingAfter: 80 }));

  // col widths: description, specs, qty, unit price, total price
  const priceCols = [3200, 2600, 800, 1400, 1638];
  const priceHeaderCells = [
    { text: t.colDescription, width: priceCols[0] },
    { text: t.colSpecs, width: priceCols[1] },
    { text: t.colQty, width: priceCols[2] },
    { text: t.colUnitPrice, width: priceCols[3] },
    { text: t.colTotalPrice, width: priceCols[4] },
  ];

  const priceRows: TableRow[] = [headerRow(priceHeaderCells)];

  // Elevator rows
  state.elevators.forEach((elev) => {
    const specLines = [
      `${elev.capacity}KG / ${elev.speed}M/S`,
      `${elev.floorsStops}`,
      `${elev.machineRoom || ''}`,
      `${elev.doorOpeningSize || ''}`,
    ]
      .filter(Boolean)
      .join(', ');

    const unitP = Number(elev.unitPrice) || 0;
    const qty = Number(elev.qty) || 1;
    priceRows.push(
      new TableRow({
        children: [
          cell(elev.description || 'Passenger Lift', { width: priceCols[0] }),
          cell(specLines, { width: priceCols[1] }),
          cell(String(qty), { width: priceCols[2], align: AlignmentType.CENTER }),
          cell(`USD ${unitP.toLocaleString()}`, { width: priceCols[3], align: AlignmentType.RIGHT }),
          cell(`USD ${(unitP * qty).toLocaleString()}`, {
            width: priceCols[4],
            align: AlignmentType.RIGHT,
          }),
        ],
      }),
    );
  });

  // Optional rows
  if (state.shaftFrame.enabled) {
    priceRows.push(
      new TableRow({
        children: [
          cell(state.shaftFrame.text, { width: priceCols[0] + priceCols[1], colSpan: 2 }),
          cell('1', { width: priceCols[2], align: AlignmentType.CENTER }),
          cell(`USD ${Number(state.shaftFrame.price).toLocaleString()}`, {
            width: priceCols[3],
            align: AlignmentType.RIGHT,
          }),
          cell(`USD ${Number(state.shaftFrame.price).toLocaleString()}`, {
            width: priceCols[4],
            align: AlignmentType.RIGHT,
          }),
        ],
      }),
    );
  }
  if (state.temperedGlass.enabled) {
    priceRows.push(
      new TableRow({
        children: [
          cell(state.temperedGlass.text, { width: priceCols[0] + priceCols[1], colSpan: 2 }),
          cell('1', { width: priceCols[2], align: AlignmentType.CENTER }),
          cell(`USD ${Number(state.temperedGlass.price).toLocaleString()}`, {
            width: priceCols[3],
            align: AlignmentType.RIGHT,
          }),
          cell(`USD ${Number(state.temperedGlass.price).toLocaleString()}`, {
            width: priceCols[4],
            align: AlignmentType.RIGHT,
          }),
        ],
      }),
    );
  }

  // Freight row
  priceRows.push(
    new TableRow({
      children: [
        cell(t.freight(state.freightDestination), {
          width: priceCols[0] + priceCols[1] + priceCols[2] + priceCols[3],
          colSpan: 4,
        }),
        cell(`USD ${Number(state.freightCost).toLocaleString()}`, {
          width: priceCols[4],
          align: AlignmentType.RIGHT,
        }),
      ],
    }),
  );

  // Total row
  priceRows.push(
    new TableRow({
      children: [
        cell(t.totalAmount, {
          width: priceCols[0] + priceCols[1] + priceCols[2] + priceCols[3],
          colSpan: 4,
          bold: true,
          bg: 'FFF2CC',
        }),
        cell(`USD ${grandTotal.toLocaleString()}`, {
          width: priceCols[4],
          align: AlignmentType.RIGHT,
          bold: true,
          bg: 'FFF2CC',
        }),
      ],
    }),
  );

  children.push(
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: priceCols,
      rows: priceRows,
    }),
  );

  children.push(para([], { spacingAfter: 200 }));

  // === TERMS ===
  children.push(para([bold(t.delivery), plain(` ${state.deliveryDays} ${t.deliverySuffix}`)], {}));
  children.push(para([bold(t.paymentTerm), plain(` ${state.paymentTerm}`)], {}));
  children.push(
    para([bold(t.warranty), plain(` ${state.warrantyMonths} ${t.warrantySuffix}`)], {}),
  );
  children.push(
    para(
      [
        bold(t.priceValidity),
        plain(
          ` ${state.priceValidityDays} ${t.days}${validUntil ? ` (${t.until} ${validUntil})` : ''}`,
        ),
      ],
      {},
    ),
  );
  children.push(para([], { spacingAfter: 200 }));

  // === SPECIFICATIONS (one per elevator) ===
  children.push(
    para([bold(t.specificationsTitle, 24)], {
      align: AlignmentType.CENTER,
      spacingAfter: 120,
    }),
  );

  const specCols = [Math.floor(CONTENT_W / 2), CONTENT_W - Math.floor(CONTENT_W / 2)];

  state.elevators.forEach((elev, idx) => {
    if (idx > 0) {
      // page break before each subsequent elevator
      children.push(new Paragraph({ children: [new PageBreak()], spacing: { after: 0 } }));
    }
    children.push(
      para([bold(t.elevatorHeader(elev.id ?? idx + 1), 22)], {
        align: AlignmentType.CENTER,
        spacingAfter: 80,
      }),
    );

    const specSection = (title: string, rows: [string, string][]) => {
      const tableRows: TableRow[] = [
        new TableRow({
          children: [
            cell(title, { bold: true, bg: 'BDD7EE', colSpan: 2, width: CONTENT_W }),
          ],
        }),
        ...rows.map(
          ([label, value]) =>
            new TableRow({
              children: [
                cell(label, { width: specCols[0], bg: 'F5F5F5' }),
                cell(value, { width: specCols[1] }),
              ],
            }),
        ),
      ];
      children.push(
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: specCols,
          rows: tableRows,
        }),
      );
      children.push(para([], { spacingAfter: 100 }));
    };

    // I. Basic
    specSection(t.secBasic, [
      [t.specDescription, elev.description ?? ''],
      [t.specType, elev.type ?? ''],
      [t.specCapacity, String(elev.capacity ?? '')],
      [t.specSpeed, String(elev.speed ?? '')],
      [t.specFloors, elev.floorsStops ?? ''],
      [t.specControl, elev.controlSystem ?? ''],
      [t.specServing, elev.servingFloors ?? ''],
      [t.specEntrances, elev.entrances ?? ''],
      [t.specPower, elev.powerVoltage ?? ''],
      [t.specLighting, elev.lightingVoltage ?? ''],
      [t.specFrequency, elev.frequency ?? ''],
      [t.specDrive, elev.driveSystem ?? ''],
    ]);

    // II. Hoistway
    specSection(t.secHoistway, [
      [t.specTravel, String(elev.travel ?? '')],
      [t.specHeadroom, String(elev.headroom ?? '')],
      [t.specPit, String(elev.pitDepth ?? '')],
      [t.specShaftSize, elev.shaftSize ?? ''],
      [t.specMachineRoom, elev.machineRoomSize ?? ''],
      [t.specShaftConst, elev.shaftConstruction ?? ''],
    ]);

    // III. Car
    specSection(t.secCar, [
      [t.specCopPlate, elev.copPlate ?? ''],
      [t.specCarDim, elev.carNetDimension ?? ''],
      [t.specCeiling, elev.carCeiling ?? ''],
      [t.specCarFloor, elev.carFloor ?? ''],
      [t.specHandrail, elev.carHandrail ?? ''],
      [t.specWallLeft, elev.carWall?.left ?? ''],
      [t.specWallRight, elev.carWall?.right ?? ''],
      [t.specWallRear, elev.carWall?.rear ?? ''],
    ]);

    // IV. Door
    specSection(t.secDoor, [
      [t.specDoorType, elev.doorOpeningType ?? ''],
      [t.specDoorSize, elev.doorOpeningSize ?? ''],
      [t.specDoorHeader, elev.doorHeaderType ?? ''],
      [t.specDoor1st, elev.firstFloorDoor ?? ''],
      [t.specDoorOther, elev.otherFloorsDoor ?? ''],
    ]);

    // V. Function
    const functionsList = (elev.otherFunctions ?? [])
      .filter((f: any) => f.checked)
      .map((f: any) => f.name)
      .join(', ');
    specSection(t.secFunction, [
      [t.specCopLop, elev.copLop ?? ''],
      [t.specIncluded, functionsList],
    ]);
  });

  // === PART LIST (new page) ===
  children.push(new Paragraph({ children: [new PageBreak()], spacing: { after: 0 } }));
  children.push(
    para([bold(t.partListTitle, 24)], { align: AlignmentType.CENTER, spacingAfter: 120 }),
  );

  const partCols = [Math.floor(CONTENT_W * 0.5), Math.floor(CONTENT_W * 0.25), CONTENT_W - Math.floor(CONTENT_W * 0.5) - Math.floor(CONTENT_W * 0.25)];
  const partRows: TableRow[] = [
    headerRow([
      { text: t.partListColPart, width: partCols[0] },
      { text: t.partListColBrand, width: partCols[1] },
      { text: t.partListColOrigin, width: partCols[2] },
    ]),
  ];

  state.partList.forEach((row) => {
    if (row.type === 'section') {
      partRows.push(
        new TableRow({
          children: [
            cell(row.label, { bold: true, bg: 'D9D9D9', colSpan: 3, width: CONTENT_W }),
          ],
        }),
      );
    } else {
      partRows.push(
        new TableRow({
          children: [
            cell(row.label, { width: partCols[0] }),
            cell(row.brand, { width: partCols[1] }),
            cell(row.origin, { width: partCols[2] }),
          ],
        }),
      );
    }
  });

  children.push(
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: partCols,
      rows: partRows,
    }),
  );

  children.push(para([], { spacingAfter: 100 }));
  children.push(
    para([new TextRun({ text: t.partListNote, italics: true, size: 16, font: 'Arial', color: '666666' })], {}),
  );

  // Footer: quotation date
  children.push(para([], { spacingAfter: 200 }));
  children.push(
    para([bold(`${t.quotationDate}: `), plain(state.quotationDate)], {
      align: AlignmentType.RIGHT,
    }),
  );

  // ── build document ────────────────────────────────────────────────────────
  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: 'Arial', size: 20 } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_WIDTH, height: 16838 }, // A4
            margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}
