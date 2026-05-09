export type Lang = 'en' | 'es';

export const translations = {
  en: {
    // Header
    quotation: 'Quotation',
    company: 'Company',
    quotationNo: 'Quotation No',
    projectName: 'Project Name',
    quotationType: 'Quotation Type',

    // Price table
    priceTitle: 'Price - Currency: USD',
    colDescription: 'Description',
    colSpecs: 'Specs',
    colQty: 'QTY-sets',
    colUnitPrice: 'Unit Price',
    colTotalPrice: 'Total Price',
    freight: (dest: string) => `Local fee and Freight from factory to ${dest} :`,
    totalAmount: 'Total amount :',

    // Terms
    delivery: 'I. Delivery:',
    deliverySuffix: 'days after receive down payment and confirmed drawing.',
    paymentTerm: 'II. Payment term:',
    warranty: 'III. Warranty:',
    warrantySuffix: 'months since goods arrival at destination port.',
    priceValidity: 'IV. Price validity:',
    days: 'days',
    until: 'until',

    // Specifications
    specificationsTitle: 'Specifications',
    elevatorHeader: (id: number) => `Elevator #L${id} Specifications`,
    secBasic: 'I. Basic specification',
    secHoistway: 'II. Hoistway specification',
    secCar: 'III. Car Specification',
    secDoor: 'IV. Door specification',
    secFunction: 'V. Function',

    // Spec labels
    specDescription: 'Description',
    specType: 'Type',
    specCapacity: 'Capacity (KG)',
    specSpeed: 'Speed (M/S)',
    specFloors: 'Floors/Stops',
    specControl: 'Control System',
    specServing: 'Serving floors (COP display)',
    specEntrances: 'Entrances',
    specPower: 'Power voltage',
    specLighting: 'Lighting voltage',
    specFrequency: 'Frequency',
    specDrive: 'Drive System',
    specShaftConst: 'Shaft construction',
    specTravel: 'Travel (mm)',
    specHeadroom: 'Headroom (mm)',
    specPit: 'Pit Depth (mm)',
    specShaftSize: 'Shaft Size (W x D mm)',
    specMachineRoom: 'Machine Room Size (W x D x H mm)',
    specCopPlate: 'COP Plate',
    specCarDim: 'Car Net Dimension',
    specCeiling: 'Car Ceiling',
    specCarFloor: 'Car Floor',
    specHandrail: 'Handrail',
    specWallLeft: 'Left wall finish',
    specWallRight: 'Right wall finish',
    specWallRear: 'Rear wall finish',
    specDoorType: 'Door Opening Type',
    specDoorSize: 'Door Opening Size (W x H mm)',
    specDoorHeader: 'Door Header Type',
    specDoor1st: '1st Floor Door Decoration',
    specDoorOther: 'Other Floors Door Decoration',
    specCopLop: 'COP/LOP',
    specIncluded: 'Included',

    // Cabin effect
    decorationTitle: 'Decoration Effect',
    decorationNote: '(Images are for reference only, subject to the real object)',
    cabin: 'CABIN',
    cop: 'COP',
    lop: 'LOP',
    cellCeiling: 'CEILING',
    cellButton: 'BUTTON',
    cellFloor: 'FLOOR',
    landingDoor: 'LANDING DOOR',
    handrail: 'HANDRAIL',
    copLogo: 'COP LOGO',

    // Part list
    partListTitle: 'Part List',
    partListColPart: 'Part',
    partListColBrand: 'Brand',
    partListColOrigin: 'Origin',
    partListNote: 'Note: In order to further improve product quality and technological innovation, and better meet customer needs, we reserve the right to change the model and origin of the individual parts mentioned above, but we guarantee that the quality and performance of the new parts are not lower than the original parts.',

    // Footer
    quotationDate: 'Quotation Date',
  },

  es: {
    // Header
    quotation: 'Cotización',
    company: 'Empresa',
    quotationNo: 'N° Cotización',
    projectName: 'Proyecto',
    quotationType: 'Tipo',

    // Price table
    priceTitle: 'Precio - Moneda: USD',
    colDescription: 'Descripción',
    colSpecs: 'Especificaciones',
    colQty: 'Cant.',
    colUnitPrice: 'Precio Unitario',
    colTotalPrice: 'Precio Total',
    freight: (dest: string) => `Flete local y desde fábrica hasta ${dest} :`,
    totalAmount: 'Monto Total :',

    // Terms
    delivery: 'I. Entrega:',
    deliverySuffix: 'días tras recibir anticipo y planos confirmados.',
    paymentTerm: 'II. Forma de pago:',
    warranty: 'III. Garantía:',
    warrantySuffix: 'meses desde la llegada al puerto de destino.',
    priceValidity: 'IV. Validez del precio:',
    days: 'días',
    until: 'hasta',

    // Specifications
    specificationsTitle: 'Especificaciones Técnicas',
    elevatorHeader: (id: number) => `Ascensor #L${id} Especificaciones`,
    secBasic: 'I. Especificación básica',
    secHoistway: 'II. Especificación del hueco',
    secCar: 'III. Especificación de cabina',
    secDoor: 'IV. Especificación de puertas',
    secFunction: 'V. Funciones',

    // Spec labels
    specDescription: 'Descripción',
    specType: 'Tipo',
    specCapacity: 'Capacidad (KG)',
    specSpeed: 'Velocidad (M/S)',
    specFloors: 'Pisos/Paradas',
    specControl: 'Sistema de control',
    specServing: 'Pisos de servicio (COP)',
    specEntrances: 'Entradas',
    specPower: 'Tensión de alimentación',
    specLighting: 'Tensión de iluminación',
    specFrequency: 'Frecuencia',
    specDrive: 'Sistema de tracción',
    specShaftConst: 'Construcción del hueco',
    specTravel: 'Recorrido (mm)',
    specHeadroom: 'Altura libre superior (mm)',
    specPit: 'Profundidad del foso (mm)',
    specShaftSize: 'Dimensión del hueco (An x Pr mm)',
    specMachineRoom: 'Sala de máquinas (An x Pr x Al mm)',
    specCopPlate: 'Panel COP',
    specCarDim: 'Dimensión neta de cabina',
    specCeiling: 'Techo de cabina',
    specCarFloor: 'Suelo de cabina',
    specHandrail: 'Pasamanos',
    specWallLeft: 'Acabado pared izquierda',
    specWallRight: 'Acabado pared derecha',
    specWallRear: 'Acabado pared trasera',
    specDoorType: 'Tipo de apertura',
    specDoorSize: 'Dimensión de apertura (An x Al mm)',
    specDoorHeader: 'Tipo de dintel',
    specDoor1st: 'Decoración puerta 1er piso',
    specDoorOther: 'Decoración puertas otros pisos',
    specCopLop: 'COP/LOP',
    specIncluded: 'Incluido',

    // Cabin effect
    decorationTitle: 'Efecto Decorativo',
    decorationNote: '(Las imágenes son solo de referencia, sujeto al objeto real)',
    cabin: 'CABINA',
    cop: 'COP',
    lop: 'LOP',
    cellCeiling: 'TECHO',
    cellButton: 'BOTÓN',
    cellFloor: 'SUELO',
    landingDoor: 'PUERTA DE PISO',
    handrail: 'PASAMANOS',
    copLogo: 'LOGO COP',

    // Part list
    partListTitle: 'Lista de Componentes',
    partListColPart: 'Componente',
    partListColBrand: 'Marca',
    partListColOrigin: 'Origen',
    partListNote: 'Nota: Con el fin de mejorar continuamente la calidad del producto e innovación tecnológica, y satisfacer mejor las necesidades del cliente, nos reservamos el derecho de cambiar el modelo y origen de los componentes mencionados anteriormente, garantizando que la calidad y el rendimiento de los nuevos componentes no sea inferior a los originales.',

    // Footer
    quotationDate: 'Fecha de Cotización',
  },
} as const;

export type Translations = typeof translations.en;
