export type EscalatorPriceRow = {
  id: number;
  liftNo: string;
  description: string;
  speed: string;
  inclination: string;
  quantity: number;
  unitPrice: number;
};

export type EscalatorSpecGroup = {
  id: number;
  no: string;
  type: string;
  qty: string;
  drawingNo: string;
  inclination: string;
  stepWidth: string;
  layoutMode: string;
  horizontalSteps: string;
  runningSpeed: string;
  travelingHeight: string;
  horizontalSpan: string;
  motorPower: string;
  frequencyConversion: string;
  handrailColor: string;
  handrailSpec: string;
  railingHeight: string;
  railingMaterial: string;
  supportMaterial: string;
  coverPlateMaterial: string;
  apronPlateMaterial: string;
  stepType: string;
  stepColor: string;
  combColor: string;
  combStructure: string;
  movableCoverPlate: string;
  machineRoomStandard: string;
  upperMachineRoomLengthening: string;
  lowerMachineRoomLengthening: string;
  lowerMachineRoomShortening: string;
  intermediateSupports: string;
  transportation: string;
  installationEnvironment: string;
  mainPower: string;
  lightingPower: string;
  voltageDifference: string;
};

export type EscalatorConfigRow = {
  id: string;
  no: string;
  name: string;
  brand: string;
  remarks: string;
  section?: boolean;
};

export type EscalatorFunctionRow = {
  id: string;
  no: string;
  name: string;
  description: string;
};

export const defaultEscalatorPriceRows: EscalatorPriceRow[] = [
  {
    id: 1,
    liftNo: '1',
    description: 'Escalators(H=5000mm)',
    speed: '0.5',
    inclination: '35°',
    quantity: 4,
    unitPrice: 12980,
  },
  {
    id: 2,
    liftNo: '2',
    description: 'Escalators(H=3500mm)',
    speed: '0.5',
    inclination: '35°',
    quantity: 4,
    unitPrice: 12140,
  },
];

export const defaultEscalatorSpecGroups: EscalatorSpecGroup[] = [
  {
    id: 1,
    no: 'E1~E4',
    type: 'Escalator',
    qty: '4',
    drawingNo: '',
    inclination: '35°',
    stepWidth: '1000mm',
    layoutMode: 'Parallel',
    horizontalSteps: 'Specific accounting required',
    runningSpeed: '0.5m/s',
    travelingHeight: '5000 mm',
    horizontalSpan: '114720 mm',
    motorPower: 'kW',
    frequencyConversion: 'Yes',
    handrailColor: 'Black',
    handrailSpec: 'Width 100 mm',
    railingHeight: '1000 mm',
    railingMaterial: 'Glass/Transparent',
    supportMaterial: 'St.St. 304',
    coverPlateMaterial: 'St.St. 304',
    apronPlateMaterial: 'St.St. 304',
    stepType: 'St.St. 430',
    stepColor: 'Stainless steel color',
    combColor: 'Stainless steel color',
    combStructure: 'Aluminum alloy',
    movableCoverPlate: 'St.St.304',
    machineRoomStandard: '√',
    upperMachineRoomLengthening: 'None',
    lowerMachineRoomLengthening: 'None',
    lowerMachineRoomShortening: 'None',
    intermediateSupports: 'None',
    transportation: 'Container',
    installationEnvironment: 'Indoor',
    mainPower: 'AC 380V, 3 phase, 50 Hz',
    lightingPower: 'AC 220V, single phase, 50Hz',
    voltageDifference: '±7%',
  },
  {
    id: 2,
    no: 'E5~E8',
    type: 'Escalator',
    qty: '4',
    drawingNo: '',
    inclination: '35°',
    stepWidth: '1000mm',
    layoutMode: 'Parallel',
    horizontalSteps: 'Specific accounting required',
    runningSpeed: '0.5m/s',
    travelingHeight: '3500 mm',
    horizontalSpan: '98090 mm',
    motorPower: 'kW',
    frequencyConversion: 'Yes',
    handrailColor: 'Black',
    handrailSpec: 'Width 100 mm',
    railingHeight: '1000 mm',
    railingMaterial: 'Glass/Transparent',
    supportMaterial: 'St.St. 304',
    coverPlateMaterial: 'St.St. 304',
    apronPlateMaterial: 'St.St. 304',
    stepType: 'St.St. 430',
    stepColor: 'Stainless steel color',
    combColor: 'Stainless steel color',
    combStructure: 'Aluminum alloy',
    movableCoverPlate: 'St.St.304',
    machineRoomStandard: '√',
    upperMachineRoomLengthening: 'None',
    lowerMachineRoomLengthening: 'None',
    lowerMachineRoomShortening: 'None',
    intermediateSupports: 'None',
    transportation: 'Container',
    installationEnvironment: 'Indoor',
    mainPower: 'AC 380V, 3 phase, 50 Hz',
    lightingPower: 'AC 220V, single phase, 50Hz',
    voltageDifference: '±7%',
  },
];

export const escalatorSpecRows: { label: string; key: keyof EscalatorSpecGroup }[] = [
  { label: '梯号 No.', key: 'no' },
  { label: '梯种 Type', key: 'type' },
  { label: '数量 Qty', key: 'qty' },
  { label: '土建图号 Drawing No.', key: 'drawingNo' },
  { label: '倾斜角度 Inclination (°)', key: 'inclination' },
  { label: '梯级宽度 / Step width (mm)', key: 'stepWidth' },
  { label: '布置方式 Layout mode', key: 'layoutMode' },
  { label: '水平梯级数量 / Number of horizontal steps', key: 'horizontalSteps' },
  { label: '运行速度 Running speed (m/s)', key: 'runningSpeed' },
  { label: '提升高度 Traveling height', key: 'travelingHeight' },
  { label: '水平跨距 Horizontal span', key: 'horizontalSpan' },
  { label: '主机功率 Motor power', key: 'motorPower' },
  { label: '是否变频 Frequency conversion or not', key: 'frequencyConversion' },
  { label: '扶手带颜色 Handrail band color', key: 'handrailColor' },
  { label: '扶手带规格 Handrail band SPEC', key: 'handrailSpec' },
  { label: '扶手栏板高度 Handrail railing height', key: 'railingHeight' },
  { label: '扶手栏板材质/颜色 Material/Color', key: 'railingMaterial' },
  { label: '扶手支撑材质 Handrail support material', key: 'supportMaterial' },
  { label: '内外盖板材质 Material of inner and outer cover plates', key: 'coverPlateMaterial' },
  { label: '围裙板材质 Apron plate material', key: 'apronPlateMaterial' },
  { label: '梯级类型 Step type', key: 'stepType' },
  { label: '梯级颜色 Step color', key: 'stepColor' },
  { label: '梳齿颜色 Comb color', key: 'combColor' },
  { label: '梳齿结构 Comb structure', key: 'combStructure' },
  { label: '活动盖板类型 Type of movable cover plate', key: 'movableCoverPlate' },
  { label: '机房长度标准 Machine room length standard', key: 'machineRoomStandard' },
  { label: '上机房加长 Upper machine room lengthening', key: 'upperMachineRoomLengthening' },
  { label: '下机房加长 Lower machine room lengthening', key: 'lowerMachineRoomLengthening' },
  { label: '下机房缩短 Lower machine room shortening', key: 'lowerMachineRoomShortening' },
  { label: '中间支撑数量 Number of intermediate supports', key: 'intermediateSupports' },
  { label: '运输方式及交货形态 Transportation mode and delivery form', key: 'transportation' },
  { label: '安装环境 Installation environment', key: 'installationEnvironment' },
  { label: '主电源 Main power supply', key: 'mainPower' },
  { label: '照明电源 Lighting power supply', key: 'lightingPower' },
  { label: '电压差 Voltage difference', key: 'voltageDifference' },
];

export const defaultEscalatorConfigRows: EscalatorConfigRow[] = [
  { id: 'drive', no: '一', name: '驱动系统 Driving system', brand: '', remarks: '', section: true },
  { id: 'gearbox', no: '1', name: '减速箱 Reduction gearbox', brand: '福玛 FUMA', remarks: '' },
  { id: 'motor', no: '2', name: '电机(IP55) Motor (Waterproof)', brand: '佳利 JIALI', remarks: '' },
  { id: 'control', no: '二', name: '控制系统 Control system', brand: '', remarks: '', section: true },
  { id: 'plc', no: '2', name: '主控电脑(PLC) Main control computer', brand: '默纳克一体机 MONARCH', remarks: '' },
  { id: 'safety-computer', no: '3', name: '安全电脑板 Safety control computer', brand: '默纳克 MONARCH', remarks: '' },
  { id: 'contactor', no: '4', name: '主接触器 Main contactor', brand: '施耐德 Schneider', remarks: '' },
  { id: 'step-system', no: '三', name: '梯路系统 Step system', brand: '', remarks: '', section: true },
  { id: 'up-down-unit', no: '1', name: '上下部总成(防水) up-down unit (Waterproof)', brand: '新达 XINDA', remarks: '＞12m带从动轮双附加制动器' },
  { id: 'step', no: '2', name: '梯级(铝合金) (防水) Step(Waterproof)', brand: '飞亚 FEIYA', remarks: '' },
  { id: 'step-chain', no: '3', name: '梯级链条(防水) Step chain (Waterproof)', brand: '奥达 AODA', remarks: '' },
  { id: 'main-roller', no: '4', name: '梯级主轮(防水) Step main roller (Waterproof)', brand: '奥达 AODA', remarks: 'φ80mm＞14m采用铝芯' },
  { id: 'secondary-roller', no: '5', name: '梯级副轮 Step secondary roller', brand: '通达 TONGDA', remarks: 'φ80mm' },
  { id: 'step-track', no: '6', name: '梯级导轨(防水) Step track(Waterproof)', brand: '新达 XINDA', remarks: '2.5mm镀锌板' },
  { id: 'truss', no: '四', name: '桁架 Truss / 角钢热浸锌 / 带油水分离器', brand: '新达 XINDA', remarks: '' },
  { id: 'handrail-system', no: '五', name: '扶手系统 Handrail system＞14m带端部回转轮', brand: '', remarks: '', section: true },
  { id: 'handrail', no: '1', name: '扶手带(室外) Handrail(Waterproof)', brand: '南龙/斌腾 Nanlong / Binteng', remarks: '' },
  { id: 'handrail-material', no: '2', name: '扶手型材 Handrail Material', brand: '新达 XINDA', remarks: '1.5mm SUS304不锈钢' },
  { id: 'wainscot', no: '3', name: '护壁板(玻璃) Wainscot (Glass)', brand: '山川 SHANCHUAN', remarks: '10mm钢化玻璃' },
  { id: 'skirt-panel', no: '4', name: '围裙板 Skirt Panel', brand: '新达 XINDA', remarks: '1.5mm SUS304不锈钢' },
  { id: 'skirt-deflector', no: '5', name: '围裙板防夹装置 Skirt Deflector', brand: '新达 XINDA', remarks: '' },
  { id: 'interior-exterior', no: '六', name: '内外盖板 Interior-exterior profile', brand: '新达 XINDA', remarks: '1.5mm SUS304不锈钢' },
  { id: 'oiling-device', no: '七', name: '加油装置 Oiling device', brand: '哈德 HADE', remarks: '' },
  { id: 'front-edge', no: '八', name: '前沿板 Front edge panel', brand: '新达 XINDA', remarks: '1.5mm SUS304不锈钢蚀刻' },
  { id: 'inverter', no: '九', name: '变频器 Inverter', brand: '默纳克一体机 MONARCH', remarks: '' },
  { id: 'safety-function', no: '十', name: '安全功能 Safety Function', brand: '', remarks: '', section: true },
  { id: 'drive-chain', no: '1', name: '驱动链断裂保护装置 Broken drive-chain protection device', brand: '', remarks: '' },
  { id: 'phase-failure', no: '2', name: '错、断相保护 Wrong phase failure', brand: '', remarks: '' },
  { id: 'step-chain-broken', no: '3', name: '梯级链断裂保护装置 Broken step chain protection device', brand: '', remarks: '' },
  { id: 'handrail-guard', no: '4', name: '扶手带出入口保护装置 Handrail exit-entry guard', brand: '', remarks: '' },
  { id: 'working-brake', no: '5', name: '工作制动器 Working brake', brand: '', remarks: '' },
  { id: 'emergency-stop', no: '6', name: '紧急停止按钮 Emergency stop button', brand: '', remarks: '' },
  { id: 'reversal', no: '7', name: '非操作逆转保护 Direction reversal device', brand: '', remarks: '' },
  { id: 'comb-safety', no: '8', name: '梳齿保护装置 Comb safety device', brand: '', remarks: '' },
  { id: 'inspection-monitor', no: '9', name: '检修盖板监测装置 Inspection panel monitor', brand: '', remarks: '' },
  { id: 'step-trap', no: '10', name: '梯级下陷保护装置 Step trap safety device', brand: '', remarks: '' },
  { id: 'motor-overpower', no: '11', name: '电机过载保护 Motor overpower protection', brand: '', remarks: '' },
  { id: 'overspeed', no: '12', name: '超速保护装置 Overspeed governor switch', brand: '', remarks: '' },
  { id: 'grounding', no: '13', name: '安全电路接地保护 Safety grounding protection', brand: '', remarks: '' },
  { id: 'breakdown-display', no: '14', name: '故障显示功能 Break-down display function', brand: '', remarks: '' },
  { id: 'step-loss', no: '15', name: '梯级缺失保护装置 Step loss safety device', brand: '', remarks: '' },
  { id: 'handrail-speed', no: '16', name: '扶手带运行速度保护 Handrail speed protection', brand: '', remarks: '' },
  { id: 'step-speed', no: '17', name: '梯级速度监控装置 Step speed monitor', brand: '', remarks: '' },
  { id: 'water-level', no: '18', name: '水位检测装置 Water level monitor', brand: '', remarks: '' },
  { id: 'anti-climb', no: '19', name: '防攀爬装置 Anti-climbing device', brand: '', remarks: '' },
  { id: 'additional-brake', no: '20', name: '附加制动器 Additional brake', brand: '', remarks: '' },
  { id: 'vf-slow', no: '21', name: '变频慢速/变频自启动 Variable-frequency slow speed / auto start', brand: '', remarks: '' },
];

export const defaultEscalatorFunctionRows: EscalatorFunctionRow[] = [
  { id: 'bidirectional', no: '1', name: '双向运行 (Bidirectional Operation)', description: '操作上下进出口处钥匙开关可实现上行或下行 (Key switches at the upper and lower entrances allow for either upward or downward operation)' },
  { id: 'maintenance', no: '3', name: '检修运行 (Maintenance Operation)', description: '操作检修盒，可进行各项检修活动 (Operate the maintenance box for various maintenance activities)' },
  { id: 'step-lighting', no: '4', name: '登梯照明 (Step Lighting)', description: '上下出入口平台设有梯级（踏板）间隙照明引导乘客登梯 (Step gap lighting at the entrance and exit platforms guides passengers onto the escalator)' },
  { id: 'fault-display', no: '5', name: '故障显示 (Fault Display)', description: '在上入口设有数码故障显示装置，以便查找各触点故障 (A digital fault display at the upper entrance helps locate contact faults)' },
  { id: 'safety-devices', no: '6', name: '安全装置 (Safety Devices)', description: '具备国家标准规定的所有安全功能 (Includes all safety functions required by national standards)' },
  { id: 'lubrication', no: '7', name: '自动润滑 (Automatic Lubrication)', description: '由微机控制，在设定的时间发出加油信号，进行自动加油润滑 (Controlled by a microprocessor, it sends oil signals at set times for automatic lubrication)' },
  { id: 'overload', no: '8', name: '过载保护 (Overload Protection)', description: '当电机持续过载时保护 (Protects when the motor is continuously overloaded)' },
  { id: 'comb', no: '9', name: '梳齿保护 (Comb Plate Protection)', description: '当异物夹入梳齿时保护 (Protects when foreign objects get caught in the comb plate)' },
  { id: 'step-collapse', no: '10', name: '梯级下陷保护 (Step Collapse Protection)', description: '当梯级损坏陷时保护 (Protects when the step collapses due to damage)' },
  { id: 'skirt', no: '11', name: '围裙保护 (Skirt Protection)', description: '当异物夹入梯级和裙板间隙时保护 (Protects when foreign objects get caught between the step and the skirt plate)' },
  { id: 'handrail-inlet', no: '12', name: '扶手带入口保护 (Handrail Inlet Protection)', description: '当扶手有异物夹入时保护 (Protects when foreign objects get caught in the handrail)' },
  { id: 'drive-chain', no: '13', name: '驱动链断保护 (Drive Chain Break Protection)', description: '当驱动链断裂或过长保护 (Protects when the drive chain breaks or is too long)' },
  { id: 'static', no: '14', name: '静电保护 (Static Electricity Protection)', description: '消除梯级或踏板在运行中产生的静电 (Eliminates static electricity generated by the steps or pedals during operation)' },
  { id: 'emergency-stop', no: '15', name: '急停保护 (Emergency Stop Protection)', description: '当需要紧急停车时保护 (Protects when an emergency stop is needed)' },
  { id: 'phase-sequence', no: '16', name: '相序保护 (Phase Sequence Protection)', description: '当电源断相或错相时保护 (Protects when there is a phase failure or wrong phase sequence)' },
  { id: 'overspeed', no: '17', name: '超速保护 (Overspeed Protection)', description: '当运行速度超过额定速度20%时保护 (Protects when the operating speed exceeds 20% of the rated speed)' },
  { id: 'reverse', no: '18', name: '防逆转保护 (Reverse Rotation Protection)', description: '当电梯出现不按指定的运行方向而向相反方向运行时保护 (Protects when the escalator runs in the opposite direction to the designated one)' },
  { id: 'anti-clamp', no: '19', name: '防夹装置 (Anti-Clamp Device)', description: '防止异物被运行的梯级与围裙板间隙夹住 (Prevents foreign objects from being trapped between the moving steps and the skirt plate)' },
  { id: 'handrail-speed', no: '20', name: '扶手带测速 (Handrail Speed Monitoring)', description: '当扶手带运行速度与梯级运行速度出现偏差时保护 (Protects when there is a deviation between the handrail speed and the step speed)' },
  { id: 'vf-speed', no: '21', name: '变频调速 (Variable Frequency Speed Control)', description: '该扶梯可编程设置为正常、慢速和停止模式，适应不同使用场景，节能高效。 / The escalator can be programmed for normal, low-speed, and stop modes, adapting to different environments for energy efficiency.' },
];
