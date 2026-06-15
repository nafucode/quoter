import { Lang } from './translations';

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
