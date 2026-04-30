export const elevatorTemplate = {
  id: 1,
  isCollapsed: false,

  // Basic Info
  description: 'Passenger Lift',
  type: 'TKJ1000/1.75-VVVF',
  capacity: 1000,
  speed: 1.75,
  floorsStops: '4/4/4',
  controlSystem: 'Simplex',
  driveSystem: 'VVVF',
  servingFloors: 'G-1F-2F-3F',
  entrances: 'Single Entrance',
  powerVoltage: '380V-3 phase',
  lightingVoltage: '220V-1 phase',
  frequency: '50HZ',
  unitPrice: 15000,
  qty: 1,

  // Hoistway specification
  headroom: 4500,
  pitDepth: 150,
  shaftSize: '2100x2100',
  machineRoomSize: '2100x3000x2500',
  shaftConstruction: 'Concrete',
  travel: 10650,

  // Car Spec
  copPlate: 'Standard',
  carNetDimension: '1000x1400x2300',
  carCeiling: 'Mirror stainless steel frame, acrylic light decoration, LED light',
  carFloor: 'PVC',
  carHandrail: '1 PCS, Round type Stainless Steel',
  carWall: {
    left: 'Hairline Stainless Steel',
    right: 'Hairline Stainless Steel',
    rear: 'Hairline Stainless Steel',
  },

  // Door Spec
  doorOpeningType: 'Center Opening',
  doorOpeningSize: '800x2100',
  doorHeaderType: 'Standard',
  firstFloorDoor: 'Etching Mirror Stainless Steel',
  otherFloorsDoor: 'Hairline Stainless Steel',

  // Function
  copLop: 'Standard',
  otherFunctions: [
    { id: 1, name: 'Automatic rescue device (ARD)', checked: true },
    { id: 2, name: 'Full collective control', checked: true },
    { id: 3, name: 'Emergency light', checked: true },
    { id: 4, name: 'Intercom system', checked: true },
  ],

  // Cabin Effect
  cabinEffect: {
    cabinImage: '',
    copImage: '',
    lopImage: '',
    ceiling: { type: 'text', value: 'As Picture' },
    button: { type: 'text', value: 'Round standard' },
    floor: { type: 'text', value: 'PVC As Picture' },
    landingDoor: { type: 'image', value: '' },
    handrail: { type: 'text', value: 'Optional' },
    copLogo: { type: 'text', value: 'Optional' },
  },
};