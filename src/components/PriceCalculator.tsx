'use client';

import { useRef, useState } from 'react';
import { Calculator, X } from 'lucide-react';
import { useQuoteStore } from '@/store/useQuoteStore';
import { calculatePrice, defaultPriceOptions, priceOptionsFromConfiguration, type ConfiguredPriceElevator, type PriceOptions } from '@/utils/priceCalculator';

const money = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 2 });
const field = 'mt-1 w-full min-w-0 rounded border border-gray-300 bg-white p-2 text-sm';

export default function PriceCalculator({ elevator }: { elevator: ConfiguredPriceElevator & { id: number; capacity: string | number; speed: string | number; floorsStops: string; machineRoom: string; description: string } }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { updateElevator, exchangeRateBasis, exchangeRate, targetCurrency } = useQuoteStore();
  const [options, setOptions] = useState<PriceOptions>({ ...defaultPriceOptions });
  const [mode, setMode] = useState<'passenger' | 'home'>('passenger');
  const [reviewedKey, setReviewedKey] = useState('');
  const lastConfiguration = useRef('');
  const input = { capacity: Number(elevator.capacity), speed: Number(elevator.speed), stops: Number(String(elevator.floorsStops).split('/')[1]), mrl: elevator.machineRoom === 'MRL' };
  const supported = /passenger|home/i.test(elevator.description);
  const regularLayout = /^\s*(\d+)\s*\/\s*\1\s*\/\s*\1\s*$/.test(elevator.floorsStops);
  const compare = supported && input.capacity === 630 && input.stops >= 2 && input.stops <= 6;
  const homeOnly = /home/i.test(elevator.description) && !compare;
  const activeMode = homeOnly ? 'home' : compare ? mode : 'passenger';
  const result = calculatePrice(input, options, activeMode);
  const basis = Number(exchangeRateBasis);
  const usd = Math.round(result.total / basis * 100) / 100;
  const validFx = Number.isFinite(basis) && basis > 0;
  const errors = [...result.errors, ...(!supported ? ['本版仅支持客梯与曳引式别墅梯'] : []), ...(!regularLayout ? ['层/站/门不同或格式不完整，需单独核价'] : []), ...(!validFx ? ['人民币兑美元基准无效'] : [])];
  const reviewKey = JSON.stringify([input, options, activeMode, elevator.description, elevator.floorsStops, exchangeRateBasis, exchangeRate, targetCurrency]);
  const reviewed = reviewedKey === reviewKey;
  const setReviewed = (value: boolean) => setReviewedKey(value ? reviewKey : '');
  const change = <K extends keyof PriceOptions>(key: K, value: PriceOptions[K]) => { setOptions(previous => ({ ...previous, [key]: value })); setReviewed(false); };
  const check = (key: 'ard' | 'stainless' | 'accessible' | 'iot' | 'firefighterPackage', label: string) => <label className="flex items-center gap-2 py-1 text-sm"><input type="checkbox" checked={options[key]} onChange={event => change(key, event.target.checked)} />{label}</label>;
  const openCalculator = () => {
    const configuration = JSON.stringify([elevator.id, input, elevator.description, elevator.otherFunctions, elevator.otherFloorsDoor]);
    if (configuration !== lastConfiguration.current) {
      setOptions(priceOptionsFromConfiguration(elevator));
      setMode('passenger');
      lastConfiguration.current = configuration;
    }
    setReviewed(false);
    dialog.current?.showModal();
  };

  return <>
    <button type="button" onClick={openCalculator} className="mt-2 inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"><Calculator size={16} />价格试算</button>
    <dialog ref={dialog} aria-labelledby={`price-title-${elevator.id}`} className="m-auto max-h-[90dvh] w-[calc(100%-24px)] max-w-xl overflow-y-auto rounded-lg bg-white p-4 text-gray-900 shadow-xl backdrop:bg-black/40 sm:p-6 print:hidden">
      <div className="flex items-center justify-between gap-3"><h2 id={`price-title-${elevator.id}`} className="text-lg font-semibold">标准价试算 · 每台</h2><button type="button" title="关闭" aria-label="关闭试算器" onClick={() => dialog.current?.close()} className="p-2"><X size={20} /></button></div>
      <p className="mt-2 text-sm text-gray-600">2026年4月价格表 · 人民币 · 内部核价</p>
      <p className="my-3 text-sm">{elevator.capacity} kg · {elevator.speed} m/s · {elevator.floorsStops} · {elevator.machineRoom}</p>
      {compare && <fieldset className="mb-4 grid grid-cols-2 gap-2"><legend className="mb-2 text-sm font-medium">630 kg · 6层及以下方案比较</legend>{(['passenger', 'home'] as const).map(value => {
        const estimate = calculatePrice(input, options, value);
        return <label key={value} className="min-w-0 rounded border border-gray-300 p-2 text-sm"><input type="radio" name={`price-mode-${elevator.id}`} checked={activeMode === value} onChange={() => { setMode(value); setReviewed(false); }} /> {value === 'home' ? '别墅梯算法' : '客梯算法'}<span className="mt-1 block">{estimate.errors.length ? '需核价' : `¥${money(estimate.total)}`}</span></label>;
      })}</fieldset>}
      <div className="my-3 flex justify-between text-lg font-semibold"><span>标准价 · 每台</span><span>{errors.length ? '待核价' : `¥${money(result.standard)}`}</span></div>
      <details className="border-t py-3"><summary className="cursor-pointer text-sm font-medium">已选配置与加价</summary>
        <p className="my-2 text-xs text-gray-600">已读取当前勾选功能；未注明冷暖的空调暂按单冷核价。非标及自定义项目需另核。</p>
        {activeMode === 'passenger' ? <>{check('ard', 'ARD 停电应急平层 · ¥1,500')}{check('stainless', '304 发纹中分层门 · 除首层外 ¥500/层')}</> : <p className="mb-2 text-sm text-gray-600">标准自动门；已含 ARD 与发纹不锈钢厅门，无机房不另加价。</p>}
        {check('accessible', '无障碍操纵箱 · ¥1,500')}{check('iot', '4G 物联网 · ¥1,500')}
        {check('firefighterPackage', '消防电梯功能包 · 固定部分 ¥4,100 + 防火电缆核实价')}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-sm">IC 卡门禁<select className={field} value={options.ic} onChange={e => change('ic', e.target.value as PriceOptions['ic'])}><option value="none">不加装</option><option value="standard">普通门禁 · ¥1,000 / 含30张卡</option><option value="floor">指定楼层 · ¥1,500 / 含30张卡</option></select></label>
          <label className="text-sm">额外 IC 卡 · ¥3/张<input className={field} type="number" min="0" step="1" disabled={options.ic === 'none'} value={options.extraCards} onChange={e => change('extraCards', Number(e.target.value))} /></label>
          <label className="text-sm">轿厢空调<select className={field} value={options.ac} onChange={e => change('ac', e.target.value as PriceOptions['ac'])}><option value="none">不加装</option><option value="cool">单冷 · ¥3,000</option><option value="heat">冷暖 · ¥4,000</option></select></label>
          <label className="text-sm">监控<select className={field} value={options.cctv} onChange={e => change('cctv', e.target.value as PriceOptions['cctv'])}><option value="none">不加装</option><option value="camera">带摄像头 · 手动核价</option><option value="interface">仅接口 · 手动核价</option></select></label>
          {options.cctv !== 'none' && <label className="text-sm">监控核实价（元）<input className={field} type="number" min="0" value={options.cctvPrice} onChange={e => change('cctvPrice', e.target.value)} /></label>}
          {options.firefighterPackage && <label className="text-sm sm:col-span-2">防火供电电缆核实价（元）<span className="block text-xs text-gray-500">依据井道单询价；三角锁免费，对讲面板 ¥2,300，500×700 mm 逃生舱 ¥1,800。</span><input className={field} type="number" min="0" value={options.fireCablePrice} onChange={e => change('fireCablePrice', e.target.value)} /></label>}
          <label className="text-sm">其他选配名称<input className={field} value={options.customLabel} onChange={e => change('customLabel', e.target.value)} /></label>
          <label className="text-sm">其他选配核实加价（元）<input className={field} type="number" min="0" value={options.customPrice} onChange={e => change('customPrice', Number(e.target.value))} /></label>
        </div>
      </details>
      <details className="border-t py-3"><summary className="cursor-pointer text-sm font-medium">计算明细</summary><dl className="mt-3 space-y-2 text-sm">{result.lines.map((line, index) => <div key={index} className="flex justify-between gap-4"><dt className="min-w-0 break-words">{line.label}</dt><dd className="shrink-0 tabular-nums">¥{money(line.amount)}</dd></div>)}</dl></details>
      <section className="grid grid-cols-1 gap-3 border-t py-3 sm:grid-cols-3">
        <label className="text-sm">客户类型<select className={field} value={options.customer} onChange={e => change('customer', e.target.value as PriceOptions['customer'])}><option value="direct">直接客户</option><option value="dealer">经销商</option></select></label>
        <label className="text-sm">调价方式<select className={field} value={options.adjustmentMode} onChange={e => change('adjustmentMode', e.target.value as PriceOptions['adjustmentMode'])}><option value="amount">金额（元）</option><option value="percent">百分比（%）</option></select></label>
        <label className="text-sm">调价（正数加价／负数减价）<input className={field} type="number" value={options.adjustment} onChange={e => change('adjustment', Number(e.target.value))} /></label>
      </section>
      <div className="border-t py-3 text-sm"><div className="flex justify-between"><span>业务调价</span><span>¥{money(result.adjustment)}</span></div><div className="my-2 flex justify-between font-semibold"><span>调价后每台金额</span><span>¥{money(result.total)}</span></div><p>换算基准：1 USD = {money(basis)} CNY</p><p className="mt-1 font-semibold">写入单价：{validFx ? `${money(usd)} USD` : '—'}</p>{targetCurrency !== 'USD' && Number(exchangeRate) > 0 && <p>目标币种参考：{money(usd * Number(exchangeRate))} {targetCurrency}</p>}</div>
      <p className="text-xs leading-5 text-gray-600">当前为标准中分门轿厢试算。异型门、观光、装修、贯通、超高及其他非标配置须核实后计入其他选配。选配费用仅用于核价，不自动修改报价配置；不含运费和安装费用。</p>
      {errors.length > 0 && <ul role="alert" className="my-3 space-y-1 text-sm text-red-700">{errors.map(error => <li key={error}>{error}</li>)}</ul>}
      <label className="my-3 flex items-start gap-2 text-sm"><input className="mt-1" type="checkbox" checked={reviewed} onChange={e => setReviewed(e.target.checked)} />已核对机房、门型、选配及适用性，非标加价无遗漏</label>
      <button type="button" disabled={errors.length > 0 || !reviewed} onClick={() => { updateElevator(elevator.id, 'unitPrice', usd); dialog.current?.close(); }} className="w-full rounded bg-blue-600 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40">写入本台单价（USD）</button>
    </dialog>
  </>;
}
