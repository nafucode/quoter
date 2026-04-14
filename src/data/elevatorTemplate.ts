export const elevatorTemplate = {
  id: 1,
  isCollapsed: false,

  // Basic Info
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
    copImage: '/Standard-COPLOP.png',
    lopImage: '/Standard-COPLOP.png',
    ceiling: { type: 'text', value: 'AS cabin picture' },
    button: { type: 'text', value: 'Round standard' },
    floor: { type: 'text', value: 'PVC As Picture' },
    landingDoor: { type: 'image', value: '' },
    handrail: { type: 'text', value: 'Optional' },
    copLogo: { type: 'text', value: 'Optional' },
  },
};