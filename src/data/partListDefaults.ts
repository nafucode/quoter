export interface PartListRow {
  id: string;
  type: 'section' | 'item';
  no?: string;
  category?: string;
  label: string;
  brand: string;
  origin: string;
}

export type PartListTemplate = 'standard' | 'platform' | 'both';

export const defaultPartList: PartListRow[] = [
  { id: 's1',       type: 'section', label: '1. Control system',        brand: '',                   origin: ''         },
  { id: 's1-1',     type: 'item',    label: '1、Controller',             brand: 'Monarch',            origin: 'Suzhou'   },
  { id: 's1-2',     type: 'item',    label: '2、Contactor',              brand: 'Fuji Electric',      origin: 'Japan'    },
  { id: 's1-3',     type: 'item',    label: '3、Frequency inverter',     brand: 'Monarch',            origin: 'Suzhou'   },

  { id: 's2',       type: 'section', label: '2. Door system',            brand: '',                   origin: ''         },
  { id: 's2-1',     type: 'item',    label: '1、Door operator',          brand: 'Ouling',             origin: 'Ningbo'   },
  { id: 's2-2',     type: 'item',    label: '2、Driver',                 brand: 'Ouling',             origin: 'Ningbo'   },

  { id: 's3',       type: 'section', label: '3. Car Operate system',     brand: '',                   origin: ''         },
  { id: 's3-1',     type: 'item',    label: '1、Display',                brand: 'FUJI',               origin: 'Suzhou'   },
  { id: 's3-2',     type: 'item',    label: '2、Operate system',         brand: 'FUJI',               origin: 'Suzhou'   },

  { id: 's4',       type: 'section', label: '4. Call system',            brand: '',                   origin: ''         },
  { id: 's4-1',     type: 'item',    label: '1、Display board',          brand: 'FUJI',               origin: 'Suzhou'   },
  { id: 's4-2',     type: 'item',    label: '2、LOP',                    brand: 'FUJI',               origin: 'Suzhou'   },

  { id: 's5',       type: 'section', label: '5. Traction drive',         brand: '',                   origin: ''         },
  { id: 's5-1',     type: 'item',    label: '1、Traction machine',       brand: 'MONA DRIVE',         origin: 'Suzhou'   },
  { id: 's5-2',     type: 'item',    label: '2、Rubber buffer',          brand: 'AODEPU',             origin: 'Ningbo'   },
  { id: 's5-3',     type: 'item',    label: '3、Traction machine encoder', brand: 'HEIDENHAIN',        origin: 'Germany'  },

  { id: 's6',       type: 'section', label: '6. Cabin',                  brand: '',                   origin: ''         },
  { id: 's6-1',     type: 'item',    label: '1、Level switch',           brand: 'Monarch',            origin: 'Suzhou'   },
  { id: 's6-2',     type: 'item',    label: '2、Overload switch',        brand: 'FUJI',               origin: 'Suzhou'   },
  { id: 's6-3',     type: 'item',    label: '3、Car parts',              brand: 'FUJI',               origin: 'Suzhou'   },

  { id: 's7',       type: 'section', label: '7. Landing door & Jamb',    brand: '',                   origin: ''         },
  { id: 's7-1',     type: 'item',    label: '1、Landing door',           brand: 'FUJI',               origin: 'Suzhou'   },
  { id: 's7-2',     type: 'item',    label: '2、Jamb',                   brand: 'FUJI',               origin: 'Suzhou'   },

  { id: 's8',       type: 'section', label: '8. Safety system',          brand: '',                   origin: ''         },
  { id: 's8-1',     type: 'item',    label: '1、Safety gear',            brand: 'AODEPU',             origin: 'Ningbo'   },
  { id: 's8-2',     type: 'item',    label: '2、Speed Governor',         brand: 'AODEPU',             origin: 'Ningbo'   },
  { id: 's8-3',     type: 'item',    label: '3、Buffer',                 brand: 'AODEPU',             origin: 'Ningbo'   },
  { id: 's8-4',     type: 'item',    label: '4、Light curtain',          brand: 'Weco/Sunny',         origin: 'Ningbo'   },

  { id: 's9',       type: 'section', label: '9. Shaft Material',         brand: '',                   origin: ''         },
  { id: 's9-1',     type: 'item',    label: '1、Guide rail',             brand: 'Oria/Gaojing',       origin: 'Zhejiang' },
  { id: 's9-2',     type: 'item',    label: '2、Counter Weight',         brand: 'FUJI',               origin: 'Suzhou'   },
  { id: 's9-3',     type: 'item',    label: '3、Hoist steel ropes',      brand: 'Langshan/Saifutian', origin: 'Suzhou'   },
  { id: 's9-4',     type: 'item',    label: '4、Traveling cable',        brand: 'KERUIDI/HEYANG',     origin: 'Suzhou'   },
];

export const platformPartList: PartListRow[] = [
  { id: 'platform-1-1', type: 'item', no: '1', category: 'Traction Drive System 曳引系统', label: 'Permanent Magnet Synchronous Traction Machine 永磁同步曳引机', brand: 'Shanghai Faxi / Eminio', origin: '' },
  { id: 'platform-1-2', type: 'item', no: '', category: '', label: 'Rotary Encoder 旋转编码器', brand: 'Shenghao / HEIDENHAIN', origin: '' },
  { id: 'platform-1-3', type: 'item', no: '', category: '', label: 'Brake 制动器', brand: 'Shanghai Faxi / Eminio', origin: '' },

  { id: 'platform-2-1', type: 'item', no: '2', category: 'Control Cabinet 控制柜系统', label: 'Control Cabinet 控制柜', brand: 'Hpmont', origin: '' },
  { id: 'platform-2-2', type: 'item', no: '', category: '', label: 'Inverter / VFD 变频器', brand: 'Hpmont', origin: '' },

  { id: 'platform-3-1', type: 'item', no: '3', category: 'Car System 轿厢系统', label: 'Car Top Components 轿顶部件', brand: 'In-house manufactured', origin: '' },
  { id: 'platform-3-2', type: 'item', no: '', category: '', label: 'Car Bottom Components 轿底部件', brand: 'In-house manufactured', origin: '' },
  { id: 'platform-3-3', type: 'item', no: '', category: '', label: 'Car Wall Components 轿壁部件', brand: 'In-house manufactured', origin: '' },

  { id: 'platform-4-1', type: 'item', no: '4', category: 'Car Operating System 轿厢控制系统', label: 'Car Control Board 轿厢控制板', brand: 'Hpmont', origin: '' },
  { id: 'platform-4-2', type: 'item', no: '', category: '', label: 'Car Command Board 轿厢指令板', brand: 'Hpmont', origin: '' },
  { id: 'platform-4-3', type: 'item', no: '', category: '', label: 'Car Display Board 轿厢显示板', brand: 'Hpmont', origin: '' },
  { id: 'platform-4-4', type: 'item', no: '', category: '', label: 'Car Operating Panel (COP) 操纵箱', brand: 'Gebang', origin: '' },

  { id: 'platform-5-1', type: 'item', no: '5', category: 'Hall Call System 外呼系统', label: 'Hall Call Button 外呼按钮', brand: 'Gebang', origin: '' },

  { id: 'platform-6-1', type: 'item', no: '6', category: 'Landing Door System 层门系统', label: 'Landing Door (Aluminum Profile) 厅门（铝型材）', brand: 'Shangshang', origin: '' },
  { id: 'platform-6-5', type: 'item', no: '', category: '', label: 'Door Frame Upright (Aluminum Profile) 门框立柱（铝型材）', brand: 'Shangshang', origin: '' },
  { id: 'platform-6-6', type: 'item', no: '', category: '', label: 'Door Sill (Hard Aluminum Alloy) 地坎（硬质铝合金）', brand: 'Shangshang', origin: '' },

  { id: 'platform-7-1', type: 'item', no: '7', category: 'Safety System 安全系统', label: 'Safety Gear 安全钳', brand: 'Shanghai Letian', origin: '' },
  { id: 'platform-8-1', type: 'item', no: '8', category: 'Leveling System 平层系统', label: 'Magnetic Scale 磁栅尺', brand: 'Airger', origin: '' },

  { id: 'platform-9-1', type: 'item', no: '9', category: 'Shaft Material System 井道材料系统', label: 'Guide Rails 导轨', brand: 'Aorunde', origin: '' },
  { id: 'platform-9-2', type: 'item', no: '', category: '', label: 'Steel Belt 钢带', brand: 'Megadyne', origin: '' },
  { id: 'platform-9-3', type: 'item', no: '', category: '', label: 'Guide Shoes 导靴', brand: 'Aodepu', origin: '' },
  { id: 'platform-9-4', type: 'item', no: '', category: '', label: 'Traveling Cable 随行电缆', brand: 'Keruidi', origin: '' },
  { id: 'platform-9-5', type: 'item', no: '', category: '', label: 'Light Curtain 光幕', brand: 'Saifute', origin: '' },
  { id: 'platform-9-6', type: 'item', no: '', category: '', label: 'Car Rear Panel 轿厢背板', brand: 'Jinmofang', origin: '' },
];

export const partListTemplates: Record<PartListTemplate, PartListRow[]> = {
  standard: defaultPartList,
  platform: platformPartList,
  both: [...defaultPartList, ...platformPartList],
};

export const partListNote =
  'Note: In order to further improve product quality and technological innovation, and better meet customer needs, we reserve the right to change the model and origin of the individual parts mentioned above, but we guarantee that the quality and performance of the new parts are not lower than the original parts.';

export const isPlatformLift = (elevator: { [key: string]: unknown }) => /platform|平台梯/i.test(String(elevator.description ?? ''));

// Called only by explicit elevator edits, never while loading saved quotations.
export function syncPartLists(elevators: { [key: string]: unknown }[], rows: PartListRow[]) {
  const platform = elevators.some(isPlatformLift);
  const standard = elevators.some(e => !isPlatformLift(e) && !/dumbwaiter|餐梯/i.test(String(e.description ?? '')));
  const partListTemplate: PartListTemplate = platform ? (standard ? 'both' : 'platform') : 'standard';
  const partList = [...rows];
  if (platform && !rows.some(r => r.id.startsWith('platform-'))) partList.push(...platformPartList.map(r => ({ ...r })));
  if (standard && !rows.some(r => !r.id.startsWith('platform-'))) partList.push(...defaultPartList.map(r => ({ ...r })));
  return { partListTemplate, partList };
}

export function platformText(text: string, language: string) {
  const index = text.search(/[\u3400-\u9fff]/);
  if (index < 0 || language === 'zh-en') return text;
  return language === 'zh' ? text.slice(index) : text.slice(0, index).trim();
}
