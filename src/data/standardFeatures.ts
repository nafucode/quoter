export interface StandardFeatureGroup {
  category: string;
  rows: Array<[string, string]>;
}

export const standardFeatures: StandardFeatureGroup[] = [
  {
    category: 'Travel Function',
    rows: [
      ['VVVF drive', 'VVVF door operator'],
      ['Independent running', 'Automatic pass without stops'],
      ['Automatically adjust door opening time', 'UCMP protection'],
      ['Express door closing', 'Car stops and door open'],
      ['Car arrival gong', 'Command register cancel'],
      ['Direct parking', 'Anti-nuisance'],
    ],
  },
  {
    category: 'Safety function',
    rows: [
      ['Photocell protection', 'Fault self-diagnosis'],
      ['Designated stop', 'Repeated door closing'],
      ['Overload holding stop', 'Up/down over-run and final limit protection'],
      ['Anti-stall timer protection', 'Down over-speed protection device'],
      ['Start protection control', 'Upward over-speed protection device'],
      ['Inspection operation', 'Steel rope slipping self-detection'],
      ['Braking force self-detection functions', 'Balance system of self-learning'],
    ],
  },
  {
    category: 'Man-machine interface',
    rows: [
      ['Micro-touch button for car call and hall call', 'Floor and direction indicator in hall'],
      ['Floor and direction indicator inside car', 'Fire man service functions'],
    ],
  },
  {
    category: 'Emergency function',
    rows: [
      ['Emergency car lighting', 'Inching running'],
      ['Five-way intercom', 'Fire emergency return'],
    ],
  },
  {
    category: 'Energy-saving function',
    rows: [
      ['Car ventilation, light automatic shut off', 'Remote shut-off'],
    ],
  },
  {
    category: 'Optional Functions',
    rows: [
      ['Leveling when power failure (ARD) included', 'CWT safety gears'],
      ['Energy-regenerating device', 'Group control'],
      ['Absolute location positioning system', '3D door protection'],
      ['Clean anti-bacteria functions of car', 'The second operation COP'],
      ['Voice announcer', 'Operation box for handicapped'],
      ['Door opening re-leveling', 'IC card control access function'],
      ['Remote monitor', 'Camera function in the car'],
    ],
  },
];
