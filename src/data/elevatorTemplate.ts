export const elevatorTemplate = {
  id: Date.now(),
  isCollapsed: false,

  // Basic Spec
  description: 'Passenger Lift',
  type: 'TKJ1000/1.75-VVVF',
  capacity: 1000,
  speed: 1.75,
  floorsStops: '4/4',
  controlSystem: 'Monarch NICE3000+',
  driveSystem: 'Gearless PM Motor',
  unitPrice: 15000,
  qty: 1,

  // Hoistway Spec
  headroom: 4500,
  pitDepth: 1500,
  shaftSize: '2100x2400',
  machineRoomSize: 'N/A',

  // Door Spec
  doorOpeningType: 'Center Opening',
  doorOpeningSize: '900x2100',
  doorHeaderType: 'Standard',
  firstFloorDoor: 'Etching Mirror Stainless Steel',
  otherFloorsDoor: 'Hairline Stainless Steel',

  // Cabin Decoration
  carWall: 'Mirror etching + Hairline stainless steel',
  carCeiling: 'Mirror stainless steel frame, acrylic light decoration, LED light',
  carFloor: 'PVC',
  carHandrail: '1 PCS, Round type Stainless Steel',

  // Function
  copLop: 'Integrated type with LCD display',
  otherFunctions: [
    { id: 1, name: 'ARD (Automatic Rescue Device)', checked: true },
    { id: 2, name: 'Intercom', checked: true },
    { id: 3, name: 'Fire Emergency Return', checked: true },
    { id: 4, name: 'Air Conditioner', checked: false },
    { id: 5, name: 'CCTV', checked: false },
  ],
};
