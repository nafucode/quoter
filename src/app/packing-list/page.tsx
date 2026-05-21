"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useQuoteStore } from "@/store/useQuoteStore";

type PackingRow = {
  id: number;
  marks: string;
  description: string;
  unit: string;
  packages: number;
  grossWeight: number;
  netWeight: number;
  measurement: number;
};

type PackingForm = {
  buyerName: string;
  buyerTel: string;
  buyerAddress: string;
  packingNo: string;
  issueDate: string;
  rows: PackingRow[];
};

type QuoteElevator = {
  id: number;
  description?: string;
  qty?: string | number;
};

type QuoteSnapshot = {
  companyName?: string;
  quotationNo?: string;
  quotationDate?: string;
  elevators?: QuoteElevator[];
};

type QuoteHistoryEntry = {
  id: number;
  quotationNo?: string;
  projectName?: string;
  companyName?: string;
  quotationType?: string;
  quotationDate?: string;
  grandTotal?: number;
  elevatorCount?: number;
  savedAt?: string;
  state?: QuoteSnapshot;
};

type PiTransferItem = {
  id: number;
  name?: string;
  quantity?: string | number;
  unit?: string;
};

type PiTransferForm = {
  buyerName?: string;
  buyerTel?: string;
  buyerAddress?: string;
  contractNo?: string;
  issueDate?: string;
  items?: PiTransferItem[];
};

const PI_TO_PACKING_KEY = "pi_to_packing_draft";

const initialForm: PackingForm = {
  buyerName: "FRANK EGBORO",
  buyerTel: "+234 803 345 4299",
  buyerAddress: "Asaba, Delta state, Nigeria",
  packingNo: "XFJH26030201PKL",
  issueDate: "2025.5.18",
  rows: [
    {
      id: 1,
      marks: "N/M",
      description: "ELEVATOR",
      unit: "1 UNIT",
      packages: 10,
      grossWeight: 2810,
      netWeight: 2700,
      measurement: 6,
    },
  ],
};

function dateForPacking(value?: string) {
  return value ? value.replaceAll("-", ".") : "";
}

function packingNoFromQuote(value?: string) {
  if (!value) return "";
  return value.toUpperCase().endsWith("PKL") ? value : `${value.replace(/P$/i, "")}PKL`;
}

function numberValue(value: string | number | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function packingFromQuote(source: QuoteSnapshot, current: PackingForm): PackingForm {
  const rows = (source.elevators || []).map((elevator, index) => {
    const qty = numberValue(elevator.qty, 1) || 1;
    return {
      id: Number(elevator.id) || index + 1,
      marks: "N/M",
      description: (elevator.description || "ELEVATOR").toUpperCase(),
      unit: `${qty} ${qty > 1 ? "UNITS" : "UNIT"}`,
      packages: qty * 10,
      grossWeight: qty * 2810,
      netWeight: qty * 2700,
      measurement: qty * 6,
    };
  });

  return {
    ...current,
    buyerName: source.companyName || current.buyerName,
    packingNo: packingNoFromQuote(source.quotationNo) || current.packingNo,
    issueDate: dateForPacking(source.quotationDate) || current.issueDate,
    rows: rows.length ? rows : current.rows,
  };
}

function packingFromPi(source: PiTransferForm, current: PackingForm): PackingForm {
  const rows = (source.items || []).map((item, index) => {
    const qty = numberValue(item.quantity, 1) || 1;
    return {
      id: Number(item.id) || index + 1,
      marks: "N/M",
      description: (item.name || "ELEVATOR").toUpperCase(),
      unit: `${qty} ${qty > 1 ? "UNITS" : "UNIT"}`,
      packages: qty * 10,
      grossWeight: qty * 2810,
      netWeight: qty * 2700,
      measurement: qty * 6,
    };
  });

  return {
    ...current,
    buyerName: source.buyerName || current.buyerName,
    buyerTel: source.buyerTel || current.buyerTel,
    buyerAddress: source.buyerAddress || current.buyerAddress,
    packingNo: packingNoFromQuote(source.contractNo) || current.packingNo,
    issueDate: source.issueDate || current.issueDate,
    rows: rows.length ? rows : current.rows,
  };
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

export default function PackingListPage() {
  const [form, setForm] = useState<PackingForm>(initialForm);
  const [quoteHistory, setQuoteHistory] = useState<QuoteHistoryEntry[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<number | null>(null);
  const quote = useQuoteStore();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("quoter_history") || "[]");
      setQuoteHistory(Array.isArray(saved) ? saved : []);
    } catch {
      setQuoteHistory([]);
    }

    try {
      const piDraft = localStorage.getItem(PI_TO_PACKING_KEY);
      if (piDraft) {
        const parsed = JSON.parse(piDraft);
        setForm((current) => packingFromPi(parsed, current));
        localStorage.removeItem(PI_TO_PACKING_KEY);
      }
    } catch {
      localStorage.removeItem(PI_TO_PACKING_KEY);
    }
  }, []);

  const totals = useMemo(
    () =>
      form.rows.reduce(
        (sum, row) => ({
          packages: sum.packages + Number(row.packages || 0),
          grossWeight: sum.grossWeight + Number(row.grossWeight || 0),
          netWeight: sum.netWeight + Number(row.netWeight || 0),
          measurement: sum.measurement + Number(row.measurement || 0),
        }),
        { packages: 0, grossWeight: 0, netWeight: 0, measurement: 0 },
      ),
    [form.rows],
  );

  const updateField = (field: keyof Omit<PackingForm, "rows">, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateRow = (id: number, field: keyof PackingRow, value: string | number) => {
    setForm((current) => ({
      ...current,
      rows: current.rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    }));
  };

  const addRow = () => {
    setForm((current) => ({
      ...current,
      rows: [
        ...current.rows,
        {
          id: Date.now(),
          marks: "N/M",
          description: "ELEVATOR",
          unit: "1 UNIT",
          packages: 0,
          grossWeight: 0,
          netWeight: 0,
          measurement: 0,
        },
      ],
    }));
  };

  const removeRow = (id: number) => {
    setForm((current) => ({
      ...current,
      rows: current.rows.filter((row) => row.id !== id),
    }));
  };

  const migrateFromQuote = () => {
    setActiveHistoryId(null);
    setForm((current) => packingFromQuote(quote, current));
  };

  const makePackingFromHistory = (entry: QuoteHistoryEntry) => {
    if (!entry.state) return;
    setActiveHistoryId(entry.id);
    setForm((current) => packingFromQuote(entry.state || {}, current));
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="no-print border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-[90vw] items-center justify-between gap-4 py-4">
          <div>
            <h1 className="text-xl font-semibold">Packing List 制作</h1>
            <p className="text-sm text-slate-500">左侧填写，右侧实时生成 Packing List。</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/pi"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              PI 制作
            </Link>
            <Link
              href="/"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              返回报价
            </Link>
            <button
              onClick={() => window.print()}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              打印 / PDF
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-[90vw] grid-cols-1 gap-4 py-5 lg:grid-cols-2">
        <section className="no-print max-h-[calc(100vh-120px)] overflow-auto rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">填写内容</h2>
            <div className="flex gap-2">
              <button
                onClick={migrateFromQuote}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                从报价迁移
              </button>
              <button
                onClick={() => setForm(initialForm)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
              >
                恢复表三示例
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Field label="Messrs." value={form.buyerName} onChange={(value) => updateField("buyerName", value)} />
            <Field label="Tel" value={form.buyerTel} onChange={(value) => updateField("buyerTel", value)} />
            <Field
              label="Address"
              value={form.buyerAddress}
              onChange={(value) => updateField("buyerAddress", value)}
              textarea
            />
            <Field label="PKL No." value={form.packingNo} onChange={(value) => updateField("packingNo", value)} />
            <Field label="Issue Date" value={form.issueDate} onChange={(value) => updateField("issueDate", value)} />
          </div>

          <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Packing Rows</h3>
              <button
                onClick={addRow}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
              >
                添加一行
              </button>
            </div>

            <div className="space-y-4">
              {form.rows.map((row, index) => (
                <div key={row.id} className="rounded-md border border-slate-200 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold">Row {index + 1}</span>
                    {form.rows.length > 1 && (
                      <button
                        onClick={() => removeRow(row.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        删除
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Marks" value={row.marks} onChange={(value) => updateRow(row.id, "marks", value)} compact />
                    <Field label="UNIT" value={row.unit} onChange={(value) => updateRow(row.id, "unit", value)} compact />
                    <Field
                      label="Commodity Description"
                      value={row.description}
                      onChange={(value) => updateRow(row.id, "description", value)}
                      className="col-span-2"
                      compact
                    />
                    <NumberField label="PKGS" value={row.packages} onChange={(value) => updateRow(row.id, "packages", value)} />
                    <NumberField label="G.W. (KGS)" value={row.grossWeight} onChange={(value) => updateRow(row.id, "grossWeight", value)} />
                    <NumberField label="N.W. (KGS)" value={row.netWeight} onChange={(value) => updateRow(row.id, "netWeight", value)} />
                    <NumberField label="MEAS. (CBM)" value={row.measurement} onChange={(value) => updateRow(row.id, "measurement", value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <HistoryList
            activeHistoryId={activeHistoryId}
            entries={quoteHistory}
            emptyText="还没有历史报价。先在报价页保存到报价库后，这里就能直接选择制作 Packing List。"
            onSelect={makePackingFromHistory}
          />
        </section>

        <section className="print-only-full-width overflow-auto rounded-lg bg-white p-4 shadow-sm">
          <div className="mx-auto min-h-[1120px] w-full max-w-[794px] bg-white p-8 text-[11px] leading-snug text-black shadow-sm print:min-h-0 print:w-full print:max-w-none print:p-0 print:text-[12px] print:shadow-none">
            <div className="mb-5">
              <Header />
            </div>
            <div className="text-center">
              <h2 className="text-[18px] font-bold">
                Suzhou Xinfuji Electromechanical Co., Ltd.
              </h2>
              <p className="mt-3">
                Dade Industrial Zone, Taoyuan Town, Wujiang District, Suzhou City, Jiangsu
                Province, China.
              </p>
              <p>
                Tel: +86 18018599919&nbsp;&nbsp;&nbsp; Website: www.xinfuji.com&nbsp;&nbsp;&nbsp;
                E-mail: info@xinfuji.com
              </p>
            </div>

            <h1 className="mt-6 text-center text-[20px] font-bold tracking-wide">
              PACKING LIST
            </h1>

            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1">
              <PreviewRow label="Messrs.:" value={form.buyerName} />
              <PreviewRow label="PKL No.:" value={form.packingNo} />
              <PreviewRow label="Tel:" value={form.buyerTel} />
              <PreviewRow label="Issue Date:" value={form.issueDate} />
              <PreviewRow label="Address:" value={form.buyerAddress} className="col-span-2" />
            </div>

            <h2 className="mt-10 border border-black py-2 text-center text-[15px] font-bold">
              DETAILED PACKING LIST (Weight List) &amp; MEASUREMENT LIST
            </h2>

            <table className="w-full border-collapse text-center">
              <thead>
                <tr>
                  <th className="border border-black px-2 py-2">Marks</th>
                  <th className="border border-black px-2 py-2">Commodity Description</th>
                  <th className="border border-black px-2 py-2">UNIT</th>
                  <th className="border border-black px-2 py-2">PKGS</th>
                  <th className="border border-black px-2 py-2">G.W.(KGS)</th>
                  <th className="border border-black px-2 py-2">N.W.(KGS)</th>
                  <th className="border border-black px-2 py-2">MEAS.<br />(CBM)</th>
                </tr>
              </thead>
              <tbody>
                {form.rows.map((row) => (
                  <tr key={row.id}>
                    <td className="border border-black px-2 py-4">{row.marks}</td>
                    <td className="border border-black px-2 py-4">{row.description}</td>
                    <td className="border border-black px-2 py-4">{row.unit}</td>
                    <td className="border border-black px-2 py-4">{formatNumber(Number(row.packages || 0))}</td>
                    <td className="border border-black px-2 py-4">{formatNumber(Number(row.grossWeight || 0))}</td>
                    <td className="border border-black px-2 py-4">{formatNumber(Number(row.netWeight || 0))}</td>
                    <td className="border border-black px-2 py-4">{formatNumber(Number(row.measurement || 0))}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="border border-black px-2 py-3" colSpan={3}>
                    TOTAL:
                  </td>
                  <td className="border border-black px-2 py-3">{formatNumber(totals.packages)}</td>
                  <td className="border border-black px-2 py-3">{formatNumber(totals.grossWeight)}</td>
                  <td className="border border-black px-2 py-3">{formatNumber(totals.netWeight)}</td>
                  <td className="border border-black px-2 py-3">{formatNumber(totals.measurement)}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-28 grid grid-cols-2 gap-12 text-center">
              <div />
              <div>Seller (stamp&amp;sign)</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea = false,
  compact = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={`${compact ? "text-xs" : "text-sm"} font-medium text-slate-700`}>
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={2}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      )}
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
    </label>
  );
}

function HistoryList({
  activeHistoryId,
  entries,
  emptyText,
  onSelect,
}: {
  activeHistoryId: number | null;
  entries: QuoteHistoryEntry[];
  emptyText: string;
  onSelect: (entry: QuoteHistoryEntry) => void;
}) {
  return (
    <div className="mt-6 border-t border-slate-200 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">
          历史报价
          <span className="ml-2 text-sm font-normal text-slate-400">{entries.length} 份</span>
        </h3>
        <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          管理报价
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => {
            const isActive = activeHistoryId === entry.id;
            const total = entry.grandTotal
              ? `$${Math.round(entry.grandTotal).toLocaleString("en-US")}`
              : "-";
            const savedAt = entry.savedAt
              ? new Date(entry.savedAt).toLocaleDateString("zh-CN", {
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            return (
              <div
                key={entry.id}
                className={`rounded-md border p-3 transition-colors ${
                  isActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-blue-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-slate-900">
                        {entry.quotationNo || "未命名报价"}
                      </span>
                      {entry.quotationType && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                          {entry.quotationType}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 truncate text-xs text-slate-500">
                      {entry.companyName || "-"} · {entry.projectName || "-"}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {entry.quotationDate || "-"} ·{" "}
                      {entry.elevatorCount || entry.state?.elevators?.length || 0} 台 · {total} ·{" "}
                      {savedAt}
                    </div>
                  </div>
                  <button
                    onClick={() => onSelect(entry)}
                    className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-semibold ${
                      isActive
                        ? "bg-blue-700 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isActive ? "已选择" : "制作 PL"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PreviewRow({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-[110px_1fr] gap-2 ${className}`}>
      <span className="font-bold">{label}</span>
      <span className="whitespace-pre-wrap">{value}</span>
    </div>
  );
}
