export interface PartListRow {
  id: string;
  type: 'section' | 'item';
  label: string;
  brand: string;
  origin: string;
}

export const defaultPartList: PartListRow[] = [
  { id: 's1',       type: 'section', label: '1. Control system',        brand: '',                   origin: ''         },
  { id: 's1-1',     type: 'item',    label: '1、Controller',             brand: 'Monarch',            origin: 'Suzhou'   },
  { id: 's1-2',     type: 'item',    label: '2、Contactor',              brand: 'FUJI',               origin: 'Japan'    },
  { id: 's1-3',     type: 'item',    label: '3、Frequency inverter',     brand: 'Monarch',            origin: 'Suzhou'   },

  { id: 's2',       type: 'section', label: '2. Door system',            brand: '',                   origin: ''         },
  { id: 's2-1',     type: 'item',    label: '1、Door operator',          brand: 'Shenling/Ouling',    origin: 'Ningbo'   },
  { id: 's2-2',     type: 'item',    label: '2、Driver',                 brand: 'Shenling/Ouling',    origin: 'Ningbo'   },

  { id: 's3',       type: 'section', label: '3. Car Operate system',     brand: '',                   origin: ''         },
  { id: 's3-1',     type: 'item',    label: '1、Display',                brand: 'XINFUJI',            origin: 'Suzhou'   },
  { id: 's3-2',     type: 'item',    label: '2、Operate system',         brand: 'XINFUJI',            origin: 'Suzhou'   },

  { id: 's4',       type: 'section', label: '4. Call system',            brand: '',                   origin: ''         },
  { id: 's4-1',     type: 'item',    label: '1、Display board',          brand: 'XINFUJI',            origin: 'Suzhou'   },
  { id: 's4-2',     type: 'item',    label: '2、LOP',                    brand: 'XINFUJI',            origin: 'Suzhou'   },

  { id: 's5',       type: 'section', label: '5. Traction drive',         brand: '',                   origin: ''         },
  { id: 's5-1',     type: 'item',    label: '1、Traction machine',       brand: 'MONA DRIVE',         origin: 'Suzhou'   },
  { id: 's5-2',     type: 'item',    label: '2、Rubber buffer',          brand: 'AODEPU',             origin: 'Ningbo'   },
  { id: 's5-3',     type: 'item',    label: '3、Rotate encoder',         brand: 'Huitong',            origin: 'Changchun'},

  { id: 's6',       type: 'section', label: '6. Cabin',                  brand: '',                   origin: ''         },
  { id: 's6-1',     type: 'item',    label: '1、Level switch',           brand: 'Monarch',            origin: 'Suzhou'   },
  { id: 's6-2',     type: 'item',    label: '2、Overload switch',        brand: 'XINFUJI',            origin: 'Suzhou'   },
  { id: 's6-3',     type: 'item',    label: '3、Car parts',              brand: 'XINFUJI',            origin: 'Suzhou'   },

  { id: 's7',       type: 'section', label: '7. Landing door & Jamb',    brand: '',                   origin: ''         },
  { id: 's7-1',     type: 'item',    label: '1、Landing door',           brand: 'XINFUJI',            origin: 'Suzhou'   },
  { id: 's7-2',     type: 'item',    label: '2、Jamb',                   brand: 'XINFUJI',            origin: 'Suzhou'   },

  { id: 's8',       type: 'section', label: '8. Safety system',          brand: '',                   origin: ''         },
  { id: 's8-1',     type: 'item',    label: '1、Safety gear',            brand: 'AODEPU',             origin: 'Ningbo'   },
  { id: 's8-2',     type: 'item',    label: '2、Speed Governor',         brand: 'AODEPU',             origin: 'Ningbo'   },
  { id: 's8-3',     type: 'item',    label: '3、Buffer',                 brand: 'AODEPU',             origin: 'Ningbo'   },
  { id: 's8-4',     type: 'item',    label: '4、Light curtain',          brand: 'Weco/Sunny',         origin: 'Ningbo'   },

  { id: 's9',       type: 'section', label: '9. Shaft Material',         brand: '',                   origin: ''         },
  { id: 's9-1',     type: 'item',    label: '1、Guide rail',             brand: 'Oria/Gaojing',       origin: 'Zhejiang' },
  { id: 's9-2',     type: 'item',    label: '2、Counter Weight',         brand: 'XINFUJI',            origin: 'Suzhou'   },
  { id: 's9-3',     type: 'item',    label: '3、Hoist steel ropes',      brand: 'Langshan/Saifutian', origin: 'Suzhou'   },
  { id: 's9-4',     type: 'item',    label: '4、Traveling cable',        brand: 'KERUIDI/HEYANG',     origin: 'Suzhou'   },
];

export const partListNote =
  'Note: In order to further improve product quality and technological innovation, and better meet customer needs, we reserve the right to change the model and origin of the individual parts mentioned above, but we guarantee that the quality and performance of the new parts are not lower than the original parts.';
