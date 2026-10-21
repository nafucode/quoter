export type PriceOptions = {
  ard: boolean;
  stainless: boolean;
  accessible: boolean;
  ic: 'none' | 'standard' | 'floor';
  extraCards: number;
  ac: 'none' | 'cool' | 'heat';
  iot: boolean;
  cctv: 'none' | 'camera' | 'interface';
  cctvPrice: string;
  customLabel: string;
  customPrice: number;
  adjustment: number;
  adjustmentMode: 'amount' | 'percent';
  customer: 'direct' | 'dealer';
};
export const defaultPriceOptions: PriceOptions = {
  ard: true, stainless: true, accessible: false, ic: 'none', extraCards: 0,
  ac: 'none', iot: false, cctv: 'none', cctvPrice: '', customLabel: '',
  customPrice: 0, adjustment: 0, adjustmentMode: 'amount', customer: 'direct',
};
export type ConfiguredPriceElevator = {
  otherFunctions?: { name: string; checked: boolean }[];
  otherFloorsDoor?: string;
};

export function priceOptionsFromConfiguration(elevator: ConfiguredPriceElevator): PriceOptions {
  const names = (elevator.otherFunctions ?? []).filter(item => item.checked).map(item => item.name.toLowerCase());
  const has = (pattern: RegExp) => names.some(name => pattern.test(name));
  const cards = names.find(name => /ic card|ic卡|刷卡/i.test(name));
  const cardCount = Number(cards?.match(/(\d+)\s*(?:ic\s*cards?|张)/i)?.[1] ?? 30);
  return {
    ...defaultPriceOptions,
    ard: has(/\bard\b|automatic rescue|停电应急/),
    stainless: /hairline|发纹|拉丝/i.test(elevator.otherFloorsDoor ?? '') && /stainless|不锈钢/i.test(elevator.otherFloorsDoor ?? ''),
    accessible: has(/accessible car operating|无障碍|残疾人操纵/),
    ic: cards ? (/floor|指定楼层/.test(cards) ? 'floor' : 'standard') : 'none',
    extraCards: cards ? Math.max(0, cardCount - 30) : 0,
    ac: has(/air conditioner|空调/) ? (has(/heat|冷暖/) ? 'heat' : 'cool') : 'none',
    iot: has(/\biot\b|物联网/),
    cctv: has(/cctv|监控/) ? (has(/interface|接口/) ? 'interface' : 'camera') : 'none',
  };
}
export type PriceInput = { capacity: number; speed: number; stops: number; mrl: boolean };
export type PriceResult = { lines: { label: string; amount: number }[]; errors: string[]; standard: number; adjustment: number; total: number };

// Prices are CNY per elevator. Source: 2026 overseas price list, April 1.
export function calculatePrice(input: PriceInput, options: PriceOptions, mode: 'passenger' | 'home'): PriceResult {
  const { capacity, speed, stops, mrl } = input;
  const lines: PriceResult['lines'] = [];
  const errors: string[] = [];
  const add = (label: string, amount: number) => lines.push({ label, amount });
  if (!Number.isInteger(stops) || stops < 2) errors.push('层站数须为至少 2 的整数');
  if (mode === 'home') {
    if (![400, 450, 630].includes(capacity) || stops > 6 || !((speed >= 0.4 && speed <= 0.63) || speed === 1)) {
      errors.push('别墅梯试算限 400/450/630 kg、2–6 层站、0.4–0.63 或 1.0 m/s');
    }
    add('曳引式别墅梯 · 2层站自动门基价', 48000);
    add(`${stops - 2} 层 × ¥2,000`, (stops - 2) * 2000);
    if (capacity === 630) add('630 kg 升级', 2000);
    if (speed === 1) add('1.0 m/s 升级', 2000);
    add('ARD、标准不锈钢厅门已包含；不另加无机房费', 0);
  } else {
    const index = capacity === 630 ? 0 : capacity === 800 ? 1 : capacity === 1000 ? 2 : capacity >= 1150 && capacity <= 1350 ? 3 : capacity === 1600 ? 4 : -1;
    const tier = speed >= 1 && speed <= 1.75 ? 0 : speed === 2 ? 1 : speed === 2.5 ? 2 : speed === 3 ? 3 : -1;
    if (index < 0 || tier < 0) errors.push('该载重或速度无客梯基价，需单独核价');
    if (index >= 0 && tier >= 0) {
      const base = [[61000,62000,63000,71000,78000],[69000,70000,71000,81000,88000],[125000,127000,130000,145000,155000],[273000,276000,280000,298000,310000]][tier][index];
      const baseline = tier < 2 ? 10 : 30;
      const up = [[2000,2000,2000,2500,3000],[2200,2200,2200,2500,3000],[2500,2500,2500,2700,3000],[3600,3600,3600,4000,4000]][tier][index];
      const down = tier === 3 ? [2500,2500,2500,2800,3000][index] : 2000;
      add(`${baseline}层站客梯基价`, base);
      add(`${stops >= baseline ? '加' : '减'} ${Math.abs(stops-baseline)} 层 × ¥${stops >= baseline ? up : down}`, (stops-baseline)*(stops >= baseline ? up : down));
      if (mrl && tier === 3) errors.push('3.0 m/s 无机房加价未列，需单独核价');
      else if (mrl) add('无机房', tier === 2 ? 15000 : 3000);
      if (options.ard) {
        if (capacity > 1050 || speed > 1.75) errors.push('此载重或速度的 ARD 需另询价');
        else add('ARD', 1500);
      }
      if (options.stainless) add(`304 发纹中分层门 · ${stops-1} 层 × ¥500`, (stops-1)*500);
    }
  }
  if (options.accessible) add('无障碍操纵箱', 1500);
  if (options.ic !== 'none') {
    add(options.ic === 'standard' ? '普通 IC 门禁 · 含30张卡' : '指定楼层 IC 门禁 · 含30张卡', options.ic === 'standard' ? 1000 : 1500);
    if (!Number.isInteger(options.extraCards) || options.extraCards < 0) errors.push('额外卡片数量须为非负整数');
    else if (options.extraCards) add(`额外 ${options.extraCards} 张 IC 卡`, options.extraCards*3);
  }
  if (options.ac !== 'none') add(options.ac === 'cool' ? '单冷空调' : '冷暖空调', options.ac === 'cool' ? 3000 : 4000);
  if (options.iot) add('4G 物联网', 1500);
  if (options.cctv !== 'none') {
    if (!options.cctvPrice.trim() || !Number.isFinite(Number(options.cctvPrice)) || Number(options.cctvPrice) < 0) errors.push('请填写已核实的监控价格');
    else add(options.cctv === 'camera' ? '监控含摄像头 · 手动核价' : '监控接口 · 手动核价', Number(options.cctvPrice));
  }
  if (!Number.isFinite(options.customPrice) || options.customPrice < 0) errors.push('其他选配加价须为非负金额');
  else if (options.customPrice) add(options.customLabel.trim() || '其他选配 · 手动核价', options.customPrice);
  const standard = lines.reduce((sum, line) => sum + line.amount, 0);
  const adjustment = options.adjustmentMode === 'percent' ? standard*options.adjustment/100 : options.adjustment;
  const total = Math.round((standard+adjustment)*100)/100;
  if (!Number.isFinite(total) || total <= 0) errors.push('调价后金额须大于零');
  return { lines, errors, standard, adjustment, total };
}
