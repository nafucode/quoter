/**
 * Elevator domain value translations: English → Chinese
 * Ordered from most-specific to most-general to avoid partial-match conflicts.
 * Each entry is [RegExp, replacement].
 */
export const ZH_VALUE_MAP: [RegExp, string][] = [

  // ── Elevator type ──────────────────────────────────────────────────────────
  [/passenger\s*lift/gi,         '乘客电梯'],
  [/passenger\s*elevator/gi,     '乘客电梯'],
  [/freight\s*elevator/gi,       '货梯'],
  [/cargo\s*elevator/gi,         '货梯'],
  [/service\s*elevator/gi,       '服务电梯'],
  [/home\s*elevator/gi,          '家用电梯'],
  [/observation\s*elevator/gi,   '观光电梯'],
  [/hospital\s*elevator/gi,      '医用电梯'],
  [/dumbwaiter/gi,               '杂物梯'],
  [/escalator/gi,                '自动扶梯'],

  // ── Machine room ───────────────────────────────────────────────────────────
  [/machine\s*room\s*less/gi,    '无机房'],
  [/without\s*machine\s*room/gi, '无机房'],
  [/with\s*machine\s*room/gi,    '有机房'],
  [/\bMRL\b/g,                   '无机房（MRL）'],
  [/\bMR\b/g,                    '有机房（MR）'],

  // ── Control system ─────────────────────────────────────────────────────────
  [/group\s*control/gi,          '群控'],
  [/simplex/gi,                  '单台控制'],
  [/duplex/gi,                   '双台并联'],

  // ── Drive system ───────────────────────────────────────────────────────────
  [/gearless\s*motor\s*[-–]?\s*vvvf/gi, '无齿轮曳引机 - 变频（VVVF）'],
  [/geared\s*motor\s*[-–]?\s*vvvf/gi,   '有齿轮曳引机 - 变频（VVVF）'],
  [/gearless\s*motor/gi,         '无齿轮曳引机'],
  [/geared\s*motor/gi,           '有齿轮曳引机'],
  [/hydraulic/gi,                '液压驱动'],
  [/\bVVVF\b/g,                  '变频（VVVF）'],

  // ── Shaft construction ─────────────────────────────────────────────────────
  [/concrete/gi,                 '混凝土'],
  [/brick/gi,                    '砖墙'],
  [/steel\s*structure/gi,        '钢结构'],
  [/glass\s*shaft/gi,            '玻璃井道'],

  // ── Entrances ──────────────────────────────────────────────────────────────
  [/single\s*entrance/gi,        '单入口'],
  [/double\s*entrance/gi,        '双入口'],
  [/through\s*(car|entrance)/gi, '前后贯通'],
  [/front\s*and\s*rear/gi,       '前后贯通'],

  // ── Power / frequency ──────────────────────────────────────────────────────
  [/three[-\s]*phase/gi,         '三相'],
  [/single[-\s]*phase/gi,        '单相'],
  [/3\s*phase/gi,                '三相'],
  [/1\s*phase/gi,                '单相'],
  [/50\s*hz/gi,                  '50 Hz'],
  [/60\s*hz/gi,                  '60 Hz'],

  // ── Door opening type ──────────────────────────────────────────────────────
  [/center\s*opening/gi,         '中分门'],
  [/centre\s*opening/gi,         '中分门'],
  [/side\s*opening/gi,           '旁开门'],
  [/rear\s*opening/gi,           '后开门'],
  [/2\s*co\b/gi,                 '中分双折'],
  [/4\s*co\b/gi,                 '中分四折'],

  // ── Door header ────────────────────────────────────────────────────────────
  [/standard/gi,                 '标准'],
  [/custom/gi,                   '定制'],

  // ── Surface finishes ───────────────────────────────────────────────────────
  [/mirror\s*stainless\s*steel\s*304/gi, '镜面不锈钢304'],
  [/hairline\s*stainless\s*steel\s*304\s*(\d+\.?\d*)\s*mm/gi, '拉丝不锈钢304 $1mm'],
  [/hairline\s*stainless\s*steel\s*304/gi, '拉丝不锈钢304'],
  [/mirror\s*stainless\s*steel/gi, '镜面不锈钢'],
  [/hairline\s*stainless\s*steel/gi, '拉丝不锈钢'],
  [/etched\s*stainless\s*steel/gi, '蚀刻不锈钢'],
  [/embossed\s*stainless\s*steel/gi, '压花不锈钢'],
  [/stainless\s*steel/gi,        '不锈钢'],
  [/titanium\s*gold/gi,          '钛金'],
  [/rose\s*gold/gi,              '玫瑰金'],
  [/champagne\s*gold/gi,         '香槟金'],
  [/champagne/gi,                '香槟色'],
  [/titanium/gi,                 '钛金'],
  [/bronze/gi,                   '古铜色'],
  [/brown\s*hairline/gi,         '棕色拉丝'],
  [/\bbrown\b/gi,                '棕色'],
  [/\bgold\b/gi,                 '金色'],
  [/\bsilver\b/gi,               '银色'],
  [/\bblack\b/gi,                '黑色'],
  [/\bwhite\b/gi,                '白色'],

  // ── Ceiling / light ────────────────────────────────────────────────────────
  [/mirror\s*stainless\s*steel\s*frame,?\s*acrylic\s*light\s*decoration,?\s*led\s*light/gi,
    '镜面不锈钢框架，亚克力灯箱，LED灯'],
  [/acrylic\s*light\s*decoration/gi, '亚克力灯箱'],
  [/led\s*light/gi,              'LED灯'],
  [/fluorescent/gi,              '荧光灯'],
  [/downlight/gi,                '射灯'],
  [/as\s*picture/gi,             '如图'],

  // ── Floor materials ────────────────────────────────────────────────────────
  [/\bpvc\b/gi,                  'PVC地板'],
  [/marble/gi,                   '大理石'],
  [/granite/gi,                  '花岗岩'],
  [/laminate/gi,                 '防火板'],
  [/wooden/gi,                   '木纹地板'],
  [/carpet/gi,                   '地毯'],

  // ── Handrail ───────────────────────────────────────────────────────────────
  [/round\s*type/gi,             '圆管型'],
  [/flat\s*type/gi,              '扁管型'],
  [/square\s*type/gi,            '方管型'],
  [/(\d+)\s*pcs?\b/gi,           '$1支'],

  // ── COP/LOP ────────────────────────────────────────────────────────────────
  [/round\s*standard/gi,         '圆形标准按钮'],
  [/square\s*standard/gi,        '方形标准按钮'],

  // ── Optional / included ────────────────────────────────────────────────────
  [/optional/gi,                 '可选'],
  [/included/gi,                 '含'],
  [/not\s*included/gi,           '不含'],

  // ── Functions ──────────────────────────────────────────────────────────────
  [/automatic\s*rescue\s*device\s*\(?ard\)?/gi, '自动救援装置（ARD）'],
  [/\bard\b/gi,                  '自动救援装置（ARD）'],
  [/full\s*collective\s*control/gi, '全集选控制'],
  [/emergency\s*light/gi,        '紧急照明'],
  [/intercom\s*system/gi,        '对讲系统'],
  [/\bcctv\b/gi,                 'CCTV监控'],
  [/air\s*conditioner/gi,        '空调'],
  [/ventilation\s*fan/gi,        '通风扇'],
  [/background\s*music/gi,       '背景音乐'],
  [/card\s*reader/gi,            '刷卡器'],
  [/overload\s*(protection|device)?/gi, '超载保护'],
  [/anti[-\s]*nuisance/gi,       '防捣乱功能'],
  [/fireman'?s?\s*(service|operation)?/gi, '消防功能'],
  [/earthquake\s*(sensor|detection)?/gi, '地震感应'],
  [/remote\s*monitoring/gi,      '远程监控'],
  [/regenerative\s*drive/gi,     '能量回馈装置'],
];

/**
 * Translate a single value string using the elevator domain map.
 * Unknown terms are left unchanged.
 */
export function translateValueToZh(value: string): string {
  let result = String(value);
  for (const [pattern, replacement] of ZH_VALUE_MAP) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
