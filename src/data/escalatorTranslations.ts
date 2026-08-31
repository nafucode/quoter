import { Lang } from './translations';
import { EscalatorSpecGroup } from './escalatorDefaults';

type EscalatorLabels = {
  quotation: string;
  intro: string;
  customer: string;
  term: string;
  quotationNo: string;
  project: string;
  date: string;
  productPrice: string;
  liftNo: string;
  description: string;
  speed: string;
  inclination: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
  freight: (dest: string) => string;
  total: (term: string, dest?: string) => string;
  exchangeNote: (rate: number) => string;
  installNote: string;
  validityNote: (days: number) => string;
  containersNote: (containers: string) => string;
  paymentTerm: string;
  deliveryDate: string;
  deliveryText: (days: number) => string;
  warrantyPeriod: string;
  warrantyText: (months: number) => string;
  specification: string;
  specificationHeader: string;
  configuration: string;
  configNo: string;
  configName: string;
  configBrand: string;
  configRemarks: string;
  functionDescription: string;
  functionNo: string;
  functionName: string;
  functionText: string;
  finalNote: string;
};

const en: EscalatorLabels = {
  quotation: 'Quotation',
  intro:
    'We thank you very much for your enquiry. In the meantime, should you have any questions, please do not hesitate to contact us. We refer to the above mention project and would like to submit our price to you.',
  customer: 'Customer',
  term: 'Term',
  quotationNo: 'Quotation No.',
  project: 'Project',
  date: 'Date',
  productPrice: 'I. Product & Price',
  liftNo: 'Lift NO.',
  description: 'Description',
  speed: 'Speed / (m/s)',
  inclination: 'Inclination / (°)',
  quantity: 'Quantity (Unit)',
  unitPrice: 'Unit Price ($)',
  totalPrice: 'Total Price ($)',
  freight: (dest) => `Local freight container from factory to ${dest} :`,
  total: (term, dest) => `Total ${term}${dest ? ` ${dest}` : ''}`,
  exchangeNote: (rate) =>
    `Note: (1) Price refer to exchange 1 USD=${rate} RMB, in case the exchange rate fluctuates over ±2%, when sign the contract, the price will be adjusted accordingly.`,
  installNote: '(2) Installation & commission & certificate cost is not included.',
  validityNote: (days) => `(3) Quotation valid period: ${days} days`,
  containersNote: (containers) => `(4) Total need ${containers} containers estimate.`,
  paymentTerm: 'II. Payment term',
  deliveryDate: 'III. Delivery date',
  deliveryText: (days) =>
    `${days} days after both parties confirmed the detailed builder's work drawing, signed the commodity contract and received prepayment.`,
  warrantyPeriod: 'IV. Warranty period',
  warrantyText: (months) => `${months} months after shipping date. (Core components)`,
  specification: 'Specification',
  specificationHeader: '参数 Specification',
  configuration: '主要配置表 / Main Configuration',
  configNo: '序号 NO.',
  configName: '名称 Name',
  configBrand: '品牌 Brand',
  configRemarks: '备注 Remarks',
  functionDescription: 'Main Function Description',
  functionNo: '序号 (No.)',
  functionName: '功能名称 (Function Name)',
  functionText: '功能说明 (Function Description)',
  finalNote:
    'Note: In order to further improve product quality and promote technological innovation, and to better meet customer needs, our company reserves the right to modify the configuration and brand of certain components mentioned above. However, we guarantee that the quality of any updated components will be no lower than that of the original ones.',
};

const enOnly: EscalatorLabels = {
  ...en,
  specificationHeader: 'Specification',
  configuration: 'Main Configuration',
  configNo: 'No.',
  configName: 'Name',
  configBrand: 'Brand',
  configRemarks: 'Remarks',
  functionNo: 'No.',
  functionName: 'Function Name',
  functionText: 'Function Description',
};

export const escalatorTranslations: Record<Lang, EscalatorLabels> = {
  en,
  zh: {
    ...en,
    quotation: '报价单',
    intro: '非常感谢您的询价。如有任何问题，请随时与我们联系。关于上述项目，我司现向贵司提交如下报价。',
    customer: '客户',
    term: '贸易条款',
    quotationNo: '报价编号',
    project: '项目',
    date: '日期',
    productPrice: '一、产品及价格',
    description: '描述',
    speed: '速度 / (m/s)',
    inclination: '倾斜角 / (°)',
    quantity: '数量（台）',
    unitPrice: '单价 ($)',
    totalPrice: '总价 ($)',
    freight: (dest) => `从工厂至 ${dest} 的当地费及运费：`,
    total: (term, dest) => `总计 ${term}${dest ? ` ${dest}` : ''}`,
    exchangeNote: (rate) => `备注：(1) 价格按 1 USD=${rate} RMB 参考，如签约时汇率波动超过 ±2%，价格将相应调整。`,
    installNote: '(2) 不含安装、调试及证书费用。',
    validityNote: (days) => `(3) 报价有效期：${days} 天`,
    containersNote: (containers) => `(4) 预计需要 ${containers} 集装箱。`,
    paymentTerm: '二、付款方式',
    deliveryDate: '三、交货期',
    deliveryText: (days) => `双方确认详细土建图、签订合同并收到预付款后 ${days} 天。`,
    warrantyPeriod: '四、质保期',
    warrantyText: (months) => `发货后 ${months} 个月。（核心部件）`,
    specification: '参数规格',
    configuration: '主要配置表',
    functionDescription: '主要功能说明',
    finalNote:
      '备注：为进一步提升产品质量并推动技术创新，更好地满足客户需求，我司保留对上述部分配置及品牌进行调整的权利，但保证更新后的部件质量不低于原部件。',
  },
  es: {
    ...en,
    quotation: 'Cotización',
    intro: 'Muchas gracias por su consulta. Si tiene alguna pregunta, no dude en contactarnos. Para el proyecto mencionado, presentamos nuestra oferta.',
    customer: 'Cliente',
    term: 'Término',
    quotationNo: 'N° Cotización',
    project: 'Proyecto',
    date: 'Fecha',
    productPrice: 'I. Producto y Precio',
    description: 'Descripción',
    speed: 'Velocidad / (m/s)',
    inclination: 'Inclinación / (°)',
    quantity: 'Cantidad (Unidad)',
    unitPrice: 'Precio Unitario ($)',
    totalPrice: 'Precio Total ($)',
    freight: (dest) => `Flete local desde fábrica hasta ${dest} :`,
    total: (term, dest) => `Total ${term}${dest ? ` ${dest}` : ''}`,
    installNote: '(2) No incluye instalación, puesta en marcha ni costo de certificado.',
    paymentTerm: 'II. Condiciones de pago',
    deliveryDate: 'III. Fecha de entrega',
    warrantyPeriod: 'IV. Periodo de garantía',
    specification: 'Especificación',
    configuration: 'Configuración principal',
    functionDescription: 'Descripción de funciones principales',
  },
  pt: {
    ...en,
    quotation: 'Cotação',
    customer: 'Cliente',
    term: 'Termo',
    quotationNo: 'N° Cotação',
    project: 'Projeto',
    date: 'Data',
    productPrice: 'I. Produto e Preço',
    description: 'Descrição',
    speed: 'Velocidade / (m/s)',
    inclination: 'Inclinação / (°)',
    quantity: 'Quantidade (Unid.)',
    unitPrice: 'Preço Unitário ($)',
    totalPrice: 'Preço Total ($)',
    freight: (dest) => `Frete local da fábrica até ${dest} :`,
    paymentTerm: 'II. Condições de pagamento',
    deliveryDate: 'III. Prazo de entrega',
    warrantyPeriod: 'IV. Período de garantia',
    specification: 'Especificação',
    configuration: 'Configuração principal',
    functionDescription: 'Descrição das funções principais',
  },
  fr: {
    ...en,
    quotation: 'Devis',
    customer: 'Client',
    term: 'Terme',
    quotationNo: 'N° Devis',
    project: 'Projet',
    date: 'Date',
    productPrice: 'I. Produit et Prix',
    description: 'Description',
    speed: 'Vitesse / (m/s)',
    inclination: 'Inclinaison / (°)',
    quantity: 'Quantité (Unité)',
    unitPrice: 'Prix Unitaire ($)',
    totalPrice: 'Prix Total ($)',
    freight: (dest) => `Fret local de l'usine à ${dest} :`,
    paymentTerm: 'II. Conditions de paiement',
    deliveryDate: 'III. Date de livraison',
    warrantyPeriod: 'IV. Période de garantie',
    specification: 'Spécification',
    configuration: 'Configuration principale',
    functionDescription: 'Description des fonctions principales',
  },
  vi: {
    ...en,
    quotation: 'Báo giá',
    intro: 'Xin cảm ơn Quý khách đã gửi yêu cầu. Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi. Đối với dự án nêu trên, chúng tôi xin gửi báo giá như sau.',
    customer: 'Khách hàng',
    term: 'Điều kiện',
    quotationNo: 'Số báo giá',
    project: 'Dự án',
    date: 'Ngày',
    productPrice: 'I. Sản phẩm & Giá',
    liftNo: 'Số thang',
    description: 'Mô tả',
    speed: 'Tốc độ / (m/s)',
    inclination: 'Góc nghiêng / (°)',
    quantity: 'Số lượng (bộ)',
    unitPrice: 'Đơn giá ($)',
    totalPrice: 'Thành tiền ($)',
    freight: (dest) => `Phí vận chuyển nội địa từ nhà máy đến ${dest} :`,
    total: (term, dest) => `Tổng ${term}${dest ? ` ${dest}` : ''}`,
    exchangeNote: (rate) => `Ghi chú: (1) Giá tham chiếu theo tỷ giá 1 USD=${rate} RMB; nếu khi ký hợp đồng tỷ giá biến động quá ±2%, giá sẽ được điều chỉnh tương ứng.`,
    installNote: '(2) Không bao gồm chi phí lắp đặt, chạy thử và chứng nhận.',
    validityNote: (days) => `(3) Hiệu lực báo giá: ${days} ngày`,
    containersNote: (containers) => `(4) Dự kiến cần ${containers} container.`,
    paymentTerm: 'II. Điều khoản thanh toán',
    deliveryDate: 'III. Thời gian giao hàng',
    deliveryText: (days) => `${days} ngày sau khi hai bên xác nhận bản vẽ xây dựng chi tiết, ký hợp đồng hàng hóa và nhận thanh toán trước.`,
    warrantyPeriod: 'IV. Thời hạn bảo hành',
    warrantyText: (months) => `${months} tháng sau ngày giao hàng. (Các bộ phận chính)`,
    specification: 'Thông số kỹ thuật',
    specificationHeader: 'Thông số',
    configuration: 'Cấu hình chính',
    configNo: 'STT',
    configName: 'Tên',
    configBrand: 'Thương hiệu',
    configRemarks: 'Ghi chú',
    functionDescription: 'Mô tả chức năng chính',
    functionNo: 'STT',
    functionName: 'Tên chức năng',
    functionText: 'Mô tả chức năng',
    finalNote:
      'Ghi chú: Nhằm nâng cao chất lượng sản phẩm, thúc đẩy đổi mới công nghệ và đáp ứng tốt hơn nhu cầu khách hàng, chúng tôi có quyền điều chỉnh cấu hình và thương hiệu của một số linh kiện nêu trên. Tuy nhiên, chúng tôi cam kết chất lượng của linh kiện thay thế không thấp hơn linh kiện ban đầu.',
  },
  km: {
    ...en,
    quotation: 'សម្រង់តម្លៃ',
    intro:
      'សូមអរគុណចំពោះការសាកសួររបស់លោកអ្នក។ ប្រសិនបើមានសំណួរ សូមកុំស្ទាក់ស្ទើរក្នុងការទាក់ទងមកយើងខ្ញុំ។ សម្រាប់គម្រោងខាងលើ យើងខ្ញុំសូមដាក់ស្នើតម្លៃដូចខាងក្រោម។',
    customer: 'អតិថិជន',
    term: 'លក្ខខណ្ឌ',
    quotationNo: 'លេខសម្រង់តម្លៃ',
    project: 'គម្រោង',
    date: 'កាលបរិច្ឆេទ',
    productPrice: 'I. ផលិតផល និងតម្លៃ',
    liftNo: 'លេខជណ្តើរ',
    description: 'ការពិពណ៌នា',
    speed: 'ល្បឿន / (m/s)',
    inclination: 'មុំលំអៀង / (°)',
    quantity: 'ចំនួន (ឯកតា)',
    unitPrice: 'តម្លៃឯកតា ($)',
    totalPrice: 'តម្លៃសរុប ($)',
    freight: (dest) => `ថ្លៃដឹកជញ្ជូនក្នុងស្រុកពីរោងចក្រ ទៅ ${dest} :`,
    total: (term, dest) => `សរុប ${term}${dest ? ` ${dest}` : ''}`,
    exchangeNote: (rate) =>
      `ចំណាំ៖ (1) តម្លៃយោងតាមអត្រា 1 USD=${rate} RMB ប្រសិនបើនៅពេលចុះកិច្ចសន្យា អត្រាប្តូរប្រាក់ប្រែប្រួលលើស ±2% តម្លៃនឹងកែតម្រូវតាមនោះ។`,
    installNote: '(2) មិនរាប់បញ្ចូលថ្លៃដំឡើង សាកល្បង និងវិញ្ញាបនបត្រ។',
    validityNote: (days) => `(3) សុពលភាពសម្រង់តម្លៃ៖ ${days} ថ្ងៃ`,
    containersNote: (containers) => `(4) ប៉ាន់ស្មានត្រូវការ ${containers} កុងតឺន័រ។`,
    paymentTerm: 'II. លក្ខខណ្ឌបង់ប្រាក់',
    deliveryDate: 'III. រយៈពេលដឹកជញ្ជូន',
    deliveryText: (days) =>
      `${days} ថ្ងៃ បន្ទាប់ពីភាគីទាំងពីរបញ្ជាក់គំនូរសំណង់លម្អិត ចុះកិច្ចសន្យា និងទទួលប្រាក់កក់។`,
    warrantyPeriod: 'IV. រយៈពេលធានា',
    warrantyText: (months) => `${months} ខែ បន្ទាប់ពីថ្ងៃដឹកជញ្ជូន។ (គ្រឿងសំខាន់ៗ)`,
    specification: 'លក្ខណៈបច្ចេកទេស',
    specificationHeader: 'ប៉ារ៉ាម៉ែត្រ Specification',
    configuration: 'តារាងការកំណត់រចនាសម្ព័ន្ធសំខាន់',
    configNo: 'លេខរៀង',
    configName: 'ឈ្មោះ',
    configBrand: 'ម៉ាក',
    configRemarks: 'ចំណាំ',
    functionDescription: 'ការពិពណ៌នាមុខងារសំខាន់',
    functionNo: 'លេខរៀង',
    functionName: 'ឈ្មោះមុខងារ',
    functionText: 'ការពិពណ៌នាមុខងារ',
    finalNote:
      'ចំណាំ៖ ដើម្បីបន្តលើកកម្ពស់គុណភាពផលិតផល និងជំរុញការច្នៃប្រឌិតបច្ចេកវិទ្យា ហើយបំពេញតម្រូវការអតិថិជនឱ្យកាន់តែប្រសើរ ក្រុមហ៊ុនយើងរក្សាសិទ្ធិក្នុងការកែប្រែការកំណត់រចនាសម្ព័ន្ធ និងម៉ាកនៃគ្រឿងបន្លាស់មួយចំនួនខាងលើ។ ទោះជាយ៉ាងណា យើងធានាថាគុណភាពនៃគ្រឿងបន្លាស់ដែលបានកែប្រែ មិនទាបជាងគ្រឿងដើមឡើយ។',
  },
  ar: {
    ...en,
    quotation: 'عرض سعر',
    intro:
      'نشكركم جزيل الشكر على استفساركم. إذا كانت لديكم أي أسئلة، فلا تترددوا في التواصل معنا. وبخصوص المشروع المذكور أعلاه، نود تقديم عرض السعر التالي.',
    customer: 'العميل',
    term: 'الشروط',
    quotationNo: 'رقم عرض السعر',
    project: 'المشروع',
    date: 'التاريخ',
    productPrice: 'I. المنتج والسعر',
    liftNo: 'رقم السلم',
    description: 'الوصف',
    speed: 'السرعة / (م/ث)',
    inclination: 'زاوية الميل / (°)',
    quantity: 'الكمية (وحدة)',
    unitPrice: 'سعر الوحدة ($)',
    totalPrice: 'السعر الإجمالي ($)',
    freight: (dest) => `شحن الحاوية المحلي من المصنع إلى ${dest} :`,
    total: (term, dest) => `الإجمالي ${term}${dest ? ` ${dest}` : ''}`,
    exchangeNote: (rate) =>
      `ملاحظة: (1) السعر يعتمد على سعر صرف 1 USD=${rate} RMB، وفي حال تغير سعر الصرف بأكثر من ±2% عند توقيع العقد، يتم تعديل السعر وفقا لذلك.`,
    installNote: '(2) لا يشمل التركيب والتشغيل التجريبي وتكلفة الشهادة.',
    validityNote: (days) => `(3) مدة صلاحية العرض: ${days} يوما`,
    containersNote: (containers) => `(4) إجمالي الحاويات المطلوبة تقديريا: ${containers}.`,
    paymentTerm: 'II. شروط الدفع',
    deliveryDate: 'III. مدة التسليم',
    deliveryText: (days) =>
      `${days} يوما بعد اعتماد الطرفين لرسومات الأعمال المدنية التفصيلية وتوقيع العقد واستلام الدفعة المقدمة.`,
    warrantyPeriod: 'IV. مدة الضمان',
    warrantyText: (months) => `${months} شهرا بعد تاريخ الشحن. (المكونات الأساسية)`,
    specification: 'المواصفات',
    specificationHeader: 'المعلمات Specification',
    configuration: 'جدول التكوين الرئيسي',
    configNo: 'الرقم',
    configName: 'الاسم',
    configBrand: 'العلامة التجارية',
    configRemarks: 'ملاحظات',
    functionDescription: 'وصف الوظائف الرئيسية',
    functionNo: 'الرقم',
    functionName: 'اسم الوظيفة',
    functionText: 'وصف الوظيفة',
    finalNote:
      'ملاحظة: من أجل تحسين جودة المنتج وتعزيز الابتكار التقني وتلبية احتياجات العملاء بشكل أفضل، تحتفظ شركتنا بالحق في تعديل تكوين وعلامة بعض المكونات المذكورة أعلاه. ومع ذلك، نضمن أن جودة أي مكونات محدثة لن تكون أقل من جودة المكونات الأصلية.',
  },
  ru: {
    ...en,
    quotation: 'Коммерческое предложение',
    customer: 'Клиент',
    term: 'Условия',
    quotationNo: '№ предложения',
    project: 'Проект',
    date: 'Дата',
    productPrice: 'I. Продукт и цена',
    description: 'Описание',
    speed: 'Скорость / (м/с)',
    inclination: 'Угол наклона / (°)',
    quantity: 'Количество',
    unitPrice: 'Цена за ед. ($)',
    totalPrice: 'Итого ($)',
    freight: (dest) => `Местный фрахт с завода до ${dest} :`,
    paymentTerm: 'II. Условия оплаты',
    deliveryDate: 'III. Срок поставки',
    warrantyPeriod: 'IV. Гарантийный срок',
    specification: 'Спецификация',
    configuration: 'Основная конфигурация',
    functionDescription: 'Описание основных функций',
  },
};

const EN_SPEC_LABELS: Record<keyof EscalatorSpecGroup, string> = {
  id: 'ID',
  no: 'No.',
  type: 'Type',
  qty: 'Qty',
  drawingNo: 'Drawing No.',
  inclination: 'Inclination (°)',
  stepWidth: 'Step width (mm)',
  layoutMode: 'Layout mode',
  horizontalSteps: 'Number of horizontal steps',
  runningSpeed: 'Running speed (m/s)',
  travelingHeight: 'Traveling height',
  horizontalSpan: 'Horizontal span',
  motorPower: 'Motor power',
  frequencyConversion: 'Frequency conversion or not',
  handrailColor: 'Handrail band color',
  handrailSpec: 'Handrail band SPEC',
  railingHeight: 'Handrail railing height',
  railingMaterial: 'Material/Color',
  supportMaterial: 'Handrail support material',
  coverPlateMaterial: 'Material of inner and outer cover plates',
  apronPlateMaterial: 'Apron plate material',
  stepType: 'Step type',
  stepColor: 'Step color',
  combColor: 'Comb color',
  combStructure: 'Comb structure',
  movableCoverPlate: 'Type of movable cover plate',
  machineRoomStandard: 'Machine room length standard',
  upperMachineRoomLengthening: 'Upper machine room lengthening',
  lowerMachineRoomLengthening: 'Lower machine room lengthening',
  lowerMachineRoomShortening: 'Lower machine room shortening',
  intermediateSupports: 'Number of intermediate supports',
  transportation: 'Transportation mode and delivery form',
  installationEnvironment: 'Installation environment',
  mainPower: 'Main power supply',
  lightingPower: 'Lighting power supply',
  voltageDifference: 'Voltage difference',
};

const ES_SPEC_LABELS: Record<keyof EscalatorSpecGroup, string> = {
  id: 'ID',
  no: 'N°',
  type: 'Tipo',
  qty: 'Cantidad',
  drawingNo: 'N° de plano civil',
  inclination: 'Inclinación (°)',
  stepWidth: 'Ancho del peldaño (mm)',
  layoutMode: 'Modo de disposición',
  horizontalSteps: 'Número de peldaños horizontales',
  runningSpeed: 'Velocidad de operación (m/s)',
  travelingHeight: 'Altura de elevación',
  horizontalSpan: 'Luz horizontal',
  motorPower: 'Potencia del motor',
  frequencyConversion: 'Con variador de frecuencia',
  handrailColor: 'Color de la banda del pasamanos',
  handrailSpec: 'Especificación de la banda del pasamanos',
  railingHeight: 'Altura de la balaustrada',
  railingMaterial: 'Material/Color de la balaustrada',
  supportMaterial: 'Material del soporte del pasamanos',
  coverPlateMaterial: 'Material de cubiertas interior y exterior',
  apronPlateMaterial: 'Material del panel de faldilla',
  stepType: 'Tipo de peldaño',
  stepColor: 'Color del peldaño',
  combColor: 'Color del peine',
  combStructure: 'Estructura del peine',
  movableCoverPlate: 'Tipo de placa de cubierta móvil',
  machineRoomStandard: 'Longitud estándar de sala de máquinas',
  upperMachineRoomLengthening: 'Alargamiento sala de máquinas superior',
  lowerMachineRoomLengthening: 'Alargamiento sala de máquinas inferior',
  lowerMachineRoomShortening: 'Acortamiento sala de máquinas inferior',
  intermediateSupports: 'Número de soportes intermedios',
  transportation: 'Modo de transporte y forma de entrega',
  installationEnvironment: 'Entorno de instalación',
  mainPower: 'Alimentación principal',
  lightingPower: 'Alimentación de iluminación',
  voltageDifference: 'Variación de tensión',
};

const KM_SPEC_LABELS: Record<keyof EscalatorSpecGroup, string> = {
  id: 'ID',
  no: 'លេខ',
  type: 'ប្រភេទ',
  qty: 'ចំនួន',
  drawingNo: 'លេខគំនូរសំណង់',
  inclination: 'មុំលំអៀង (°)',
  stepWidth: 'ទទឹងជំហាន (mm)',
  layoutMode: 'របៀបរៀបចំ',
  horizontalSteps: 'ចំនួនជំហានផ្ដេក',
  runningSpeed: 'ល្បឿនដំណើរការ (m/s)',
  travelingHeight: 'កម្ពស់ដំណើរ',
  horizontalSpan: 'ចម្ងាយផ្ដេក',
  motorPower: 'ថាមពលម៉ូទ័រ',
  frequencyConversion: 'ប្រើបំលែងប្រេកង់',
  handrailColor: 'ពណ៌ខ្សែដៃចាប់',
  handrailSpec: 'លក្ខណៈខ្សែដៃចាប់',
  railingHeight: 'កម្ពស់របាំងដៃចាប់',
  railingMaterial: 'សម្ភារៈ/ពណ៌របាំង',
  supportMaterial: 'សម្ភារៈជើងទ្រដៃចាប់',
  coverPlateMaterial: 'សម្ភារៈបន្ទះគម្រប',
  apronPlateMaterial: 'សម្ភារៈបន្ទះចំហៀង',
  stepType: 'ប្រភេទជំហាន',
  stepColor: 'ពណ៌ជំហាន',
  combColor: 'ពណ៌បន្ទះសិត',
  combStructure: 'រចនាសម្ព័ន្ធបន្ទះសិត',
  movableCoverPlate: 'ប្រភេទបន្ទះគម្របចល័ត',
  machineRoomStandard: 'ប្រវែងស្តង់ដារបន្ទប់ម៉ាស៊ីន',
  upperMachineRoomLengthening: 'បន្ថែមប្រវែងបន្ទប់ម៉ាស៊ីនខាងលើ',
  lowerMachineRoomLengthening: 'បន្ថែមប្រវែងបន្ទប់ម៉ាស៊ីនខាងក្រោម',
  lowerMachineRoomShortening: 'កាត់បន្ថយប្រវែងបន្ទប់ម៉ាស៊ីនខាងក្រោម',
  intermediateSupports: 'ចំនួនជើងទ្រកណ្តាល',
  transportation: 'របៀបដឹកជញ្ជូន និងប្រគល់',
  installationEnvironment: 'បរិយាកាសដំឡើង',
  mainPower: 'ថាមពលមេ',
  lightingPower: 'ថាមពលបំភ្លឺ',
  voltageDifference: 'ភាពខុសគ្នាតង់ស្យុង',
};

const AR_SPEC_LABELS: Record<keyof EscalatorSpecGroup, string> = {
  id: 'ID',
  no: 'الرقم',
  type: 'النوع',
  qty: 'الكمية',
  drawingNo: 'رقم الرسم المدني',
  inclination: 'زاوية الميل (°)',
  stepWidth: 'عرض الدرجة (مم)',
  layoutMode: 'طريقة الترتيب',
  horizontalSteps: 'عدد الدرجات الأفقية',
  runningSpeed: 'سرعة التشغيل (م/ث)',
  travelingHeight: 'ارتفاع الرفع',
  horizontalSpan: 'الامتداد الأفقي',
  motorPower: 'قدرة المحرك',
  frequencyConversion: 'تحويل التردد',
  handrailColor: 'لون سير الدرابزين',
  handrailSpec: 'مواصفة سير الدرابزين',
  railingHeight: 'ارتفاع الدرابزين',
  railingMaterial: 'المادة/اللون',
  supportMaterial: 'مادة دعامة الدرابزين',
  coverPlateMaterial: 'مادة ألواح الغطاء',
  apronPlateMaterial: 'مادة لوحة التنورة',
  stepType: 'نوع الدرجة',
  stepColor: 'لون الدرجة',
  combColor: 'لون المشط',
  combStructure: 'هيكل المشط',
  movableCoverPlate: 'نوع لوحة الغطاء المتحركة',
  machineRoomStandard: 'طول غرفة الماكينة القياسي',
  upperMachineRoomLengthening: 'تمديد غرفة الماكينة العلوية',
  lowerMachineRoomLengthening: 'تمديد غرفة الماكينة السفلية',
  lowerMachineRoomShortening: 'تقليل غرفة الماكينة السفلية',
  intermediateSupports: 'عدد الدعامات الوسطية',
  transportation: 'طريقة النقل والتسليم',
  installationEnvironment: 'بيئة التركيب',
  mainPower: 'الطاقة الرئيسية',
  lightingPower: 'طاقة الإضاءة',
  voltageDifference: 'فرق الجهد',
};

const ES_VALUE_MAP: [RegExp, string][] = [
  [/Escalators\s*\(H=(.*?)\)/gi, 'Escaleras mecánicas (H=$1)'],
  [/430 stainless steel exterior cladding material 1\.0mm ____ m²/gi, 'Revestimiento exterior de acero inoxidable 430 1.0mm ____ m²'],
  [/\bEscalator\b/gi, 'Escalera mecánica'],
  [/\bParallel\b/gi, 'Paralelo'],
  [/Specific accounting required/gi, 'Requiere cálculo específico'],
  [/\bYes\b/gi, 'Sí'],
  [/\bNo\b/gi, 'No'],
  [/\bBlack\b/gi, 'Negro'],
  [/Width\s*100\s*mm/gi, 'Ancho 100 mm'],
  [/Glass\s*\/\s*Transparent/gi, 'Vidrio/Transparente'],
  [/St\.St\.?\s*304/gi, 'Acero inox. 304'],
  [/St\.St\.?\s*430/gi, 'Acero inox. 430'],
  [/Stainless steel color/gi, 'Color acero inoxidable'],
  [/Aluminum alloy/gi, 'Aleación de aluminio'],
  [/\bNone\b/gi, 'Ninguno'],
  [/\bContainer\b/gi, 'Contenedor'],
  [/\bIndoor\b/gi, 'Interior'],
  [/AC\s*380V,\s*3\s*phase,\s*50\s*Hz/gi, 'CA 380V, 3 fases, 50 Hz'],
  [/AC\s*220V,\s*single\s*phase,\s*50Hz/gi, 'CA 220V, monofásico, 50 Hz'],
  [/\b3\s*phase\b/gi, '3 fases'],
  [/single\s*phase/gi, 'monofásico'],
];

const KM_VALUE_MAP: [RegExp, string][] = [
  [/Escalators\s*\(H=(.*?)\)/gi, 'ជណ្តើរយន្តរំកិល (H=$1)'],
  [/430 stainless steel exterior cladding material 1\.0mm ____ m²/gi, 'សម្ភារៈគ្របខាងក្រៅដែកអ៊ីណុក 430 កម្រាស់ 1.0mm ____ m²'],
  [/\bEscalator\b/gi, 'ជណ្តើរយន្តរំកិល'],
  [/\bParallel\b/gi, 'ស្របគ្នា'],
  [/Specific accounting required/gi, 'ត្រូវការគណនាជាក់លាក់'],
  [/\bYes\b/gi, 'បាទ/ចាស'],
  [/\bNo\b/gi, 'ទេ'],
  [/\bBlack\b/gi, 'ខ្មៅ'],
  [/Width\s*100\s*mm/gi, 'ទទឹង 100 mm'],
  [/Glass\s*\/\s*Transparent/gi, 'កញ្ចក់/ថ្លា'],
  [/St\.St\.?\s*304/gi, 'ដែកអ៊ីណុក 304'],
  [/St\.St\.?\s*430/gi, 'ដែកអ៊ីណុក 430'],
  [/Stainless steel color/gi, 'ពណ៌ដែកអ៊ីណុក'],
  [/Aluminum alloy/gi, 'អាលុយមីញ៉ូមអាលុយ'],
  [/\bNone\b/gi, 'គ្មាន'],
  [/\bContainer\b/gi, 'កុងតឺន័រ'],
  [/\bIndoor\b/gi, 'ក្នុងអាគារ'],
  [/AC\s*380V,\s*3\s*phase,\s*50\s*Hz/gi, 'AC 380V, 3 ហ្វេស, 50 Hz'],
  [/AC\s*220V,\s*single\s*phase,\s*50Hz/gi, 'AC 220V, 1 ហ្វេស, 50 Hz'],
  [/\b3\s*phase\b/gi, '3 ហ្វេស'],
  [/single\s*phase/gi, '1 ហ្វេស'],
];

const AR_VALUE_MAP: [RegExp, string][] = [
  [/Escalators\s*\(H=(.*?)\)/gi, 'سلالم متحركة (H=$1)'],
  [/430 stainless steel exterior cladding material 1\.0mm ____ m²/gi, 'مادة تكسية خارجية من ستانلس ستيل 430 بسماكة 1.0mm ____ m²'],
  [/\bEscalator\b/gi, 'سلم متحرك'],
  [/\bParallel\b/gi, 'متوازي'],
  [/Specific accounting required/gi, 'يتطلب حسابا خاصا'],
  [/\bYes\b/gi, 'نعم'],
  [/\bNo\b/gi, 'لا'],
  [/\bBlack\b/gi, 'أسود'],
  [/Width\s*100\s*mm/gi, 'عرض 100 مم'],
  [/Glass\s*\/\s*Transparent/gi, 'زجاج/شفاف'],
  [/St\.St\.?\s*304/gi, 'ستانلس ستيل 304'],
  [/St\.St\.?\s*430/gi, 'ستانلس ستيل 430'],
  [/Stainless steel color/gi, 'لون ستانلس ستيل'],
  [/Aluminum alloy/gi, 'سبائك الألومنيوم'],
  [/\bNone\b/gi, 'لا يوجد'],
  [/\bContainer\b/gi, 'حاوية'],
  [/\bIndoor\b/gi, 'داخلي'],
  [/AC\s*380V,\s*3\s*phase,\s*50\s*Hz/gi, 'AC 380V، ثلاثي الطور، 50 Hz'],
  [/AC\s*220V,\s*single\s*phase,\s*50Hz/gi, 'AC 220V، أحادي الطور، 50 Hz'],
  [/\b3\s*phase\b/gi, 'ثلاثي الطور'],
  [/single\s*phase/gi, 'أحادي الطور'],
];

export function translateEscalatorSpecLabel(
  label: string,
  key: keyof EscalatorSpecGroup,
  lang: Lang,
  englishOnly = false,
) {
  if (englishOnly) return EN_SPEC_LABELS[key] || englishOnlyEscalatorText(label);
  if (lang === 'es') return ES_SPEC_LABELS[key] || label;
  if (lang === 'km') return KM_SPEC_LABELS[key] || label;
  if (lang === 'ar') return AR_SPEC_LABELS[key] || label;
  return label;
}

export function englishOnlyEscalatorText(value: string | number) {
  const raw = String(value ?? '');
  if (!raw) return '';

  const chineseNumerals: Record<string, string> = {
    一: 'I',
    二: 'II',
    三: 'III',
    四: 'IV',
    五: 'V',
    六: 'VI',
    七: 'VII',
    八: 'VIII',
    九: 'IX',
    十: 'X',
  };
  const trimmed = raw.trim();
  if (chineseNumerals[trimmed]) return chineseNumerals[trimmed];

  const spacedSlashParts = raw.split(/\s+\/\s+/);
  if (
    spacedSlashParts.length > 1 &&
    /[\u3400-\u9FFF\uF900-\uFAFF]/.test(spacedSlashParts[0]) &&
    !/[A-Za-z]/.test(spacedSlashParts[0])
  ) {
    return englishOnlyEscalatorText(spacedSlashParts.slice(1).join(' / '));
  }

  return raw
    .replace(/[＞]/g, '>')
    .replace(/[＜]/g, '<')
    .replace(/[、]/g, '')
    .replace(/[，]/g, ', ')
    .replace(/[；]/g, '; ')
    .replace(/[：]/g, ': ')
    .replace(/[。]/g, '. ')
    .replace(/[\u3400-\u9FFF\uF900-\uFAFF]/g, '')
    .replace(/[（）]/g, '')
    .replace(/[()]/g, ' ')
    .replace(/^\s*\/\s*/, '')
    .replace(/\s*\/\s*$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function getEscalatorLabels(lang: Lang, englishOnly = false) {
  return englishOnly ? enOnly : escalatorTranslations[lang] || en;
}

export function translateEscalatorValue(value: string | number, lang: Lang, englishOnly = false) {
  if (englishOnly) return englishOnlyEscalatorText(value);
  let result = String(value ?? '');
  const valueMap = lang === 'es' ? ES_VALUE_MAP : lang === 'km' ? KM_VALUE_MAP : lang === 'ar' ? AR_VALUE_MAP : null;
  if (!valueMap) return result;
  for (const [pattern, replacement] of valueMap) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
