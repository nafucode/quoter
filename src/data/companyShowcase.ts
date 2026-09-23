import type { Lang } from './translations';

type SingleLanguage = Exclude<Lang, 'zh-en'>;

const sectionAssets = [
  [
    '/company-showcase/factory-exterior.jpg',
    '/company-showcase/factory-interior.jpg',
    '/company-showcase/factory-automation.jpg',
    '/company-showcase/factory-escalator-line.jpg',
    '/company-showcase/factory-cabin-pair.jpg',
    '/company-showcase/factory-production-line.jpg',
  ],
  [
    '/company-showcase/shipping-yard.jpg',
    '/company-showcase/container-loading.jpg',
    '/company-showcase/export-dispatch.jpg',
    '/company-showcase/shipping-containers.jpg',
    '/company-showcase/shipping-wrapped-escalator.jpg',
    '/company-showcase/shipping-forklift.jpg',
  ],
  [
    '/company-showcase/project-urban-complex.jpg',
    '/company-showcase/project-alibaba-campus.jpg',
    '/company-showcase/project-catl-industrial.jpg',
    '/company-showcase/project-thailand-public-building.jpg',
    '/company-showcase/project-high-rise-residence.jpg',
    '/company-showcase/project-industrial-park.jpg',
    '/company-showcase/project-alnoor-university-iraq.jpg',
    '/company-showcase/project-nigeria.jpg',
  ],
] as const;

type ShowcaseCopy = {
  heading: string;
  sections: [string, string, string];
  captions: string[];
};

const copy: Record<SingleLanguage, ShowcaseCopy> = {
  en: {
    heading: 'Manufacturing, Global Delivery & Projects',
    sections: ['FACTORY & MANUFACTURING', 'GLOBAL DELIVERY', 'TYPICAL PROJECTS'],
    captions: [
      'Factory Panorama', 'Production Facility', 'Automated Manufacturing', 'Escalator Production', 'Cabin Assembly', 'Modern Production Line',
      'Export Shipment', 'Container Loading', 'Ready for Dispatch', 'International Shipping', 'Shipment Preparation', 'Factory Dispatch',
      'Urban Complex Project', 'Alibaba Campus Project', 'CATL Industrial Project', 'Cambodia State Guesthouse', 'High-Rise Residential Project', 'Vietnam Industrial Park Project', 'Al-Noor University, Iraq', 'Nigeria Glory Dome Landmark Project',
    ],
  },
  zh: {
    heading: '制造实力、全球交付与项目案例',
    sections: ['工厂与制造', '全球发运', '典型项目'],
    captions: [
      '工厂全景图', '生产车间', '自动化制造', '自动扶梯生产', '轿厢装配', '现代化生产线',
      '出口发运', '集装箱装载', '整装待发', '国际运输', '发运准备', '工厂发货',
      '城市综合体项目', '阿里巴巴园区项目', '宁德时代工业项目', '柬埔寨迎宾馆', '高层住宅项目', '越南工业园项目', '伊拉克努尔大学', '尼日利亚荣耀穹顶地标项目',
    ],
  },
  es: {
    heading: 'Fabricación, Entrega Global y Proyectos',
    sections: ['FÁBRICA Y FABRICACIÓN', 'ENTREGA GLOBAL', 'PROYECTOS DESTACADOS'],
    captions: [
      'Vista panorámica de la fábrica', 'Instalaciones de producción', 'Fabricación automatizada', 'Producción de escaleras mecánicas', 'Montaje de cabinas', 'Línea de producción moderna',
      'Envío de exportación', 'Carga de contenedores', 'Listo para despacho', 'Transporte internacional', 'Preparación del envío', 'Despacho desde fábrica',
      'Proyecto de complejo urbano', 'Proyecto del campus de Alibaba', 'Proyecto industrial CATL', 'Casa de Huéspedes Estatal de Camboya', 'Proyecto residencial de gran altura', 'Proyecto de parque industrial en Vietnam', 'Universidad Al-Noor, Irak', 'Proyecto emblemático Glory Dome de Nigeria',
    ],
  },
  pt: {
    heading: 'Fabricação, Entrega Global e Projetos',
    sections: ['FÁBRICA E FABRICAÇÃO', 'ENTREGA GLOBAL', 'PROJETOS DE REFERÊNCIA'],
    captions: [
      'Vista panorâmica da fábrica', 'Instalações de produção', 'Fabricação automatizada', 'Produção de escadas rolantes', 'Montagem de cabinas', 'Linha de produção moderna',
      'Remessa de exportação', 'Carregamento de contêineres', 'Pronto para expedição', 'Transporte internacional', 'Preparação da remessa', 'Expedição da fábrica',
      'Projeto de complexo urbano', 'Projeto do campus Alibaba', 'Projeto industrial CATL', 'Casa de Hóspedes Estatal do Camboja', 'Projeto residencial de grande altura', 'Projeto de parque industrial no Vietnã', 'Universidade Al-Noor, Iraque', 'Projeto emblemático Glory Dome da Nigéria',
    ],
  },
  fr: {
    heading: 'Fabrication, Livraison Mondiale et Projets',
    sections: ['USINE ET FABRICATION', 'LIVRAISON MONDIALE', 'PROJETS DE RÉFÉRENCE'],
    captions: [
      "Vue panoramique de l'usine", 'Site de production', 'Fabrication automatisée', "Production d'escaliers mécaniques", 'Assemblage de cabines', 'Ligne de production moderne',
      "Expédition à l'export", 'Chargement des conteneurs', 'Prêt à expédier', 'Transport international', "Préparation de l'expédition", "Expédition depuis l'usine",
      'Projet de complexe urbain', 'Projet du campus Alibaba', 'Projet industriel CATL', "Résidence d'État du Cambodge", 'Projet résidentiel de grande hauteur', 'Projet de parc industriel au Vietnam', 'Université Al-Noor, Irak', 'Projet emblématique Glory Dome au Nigeria',
    ],
  },
  vi: {
    heading: 'Sản Xuất, Giao Hàng Toàn Cầu và Dự Án',
    sections: ['NHÀ MÁY VÀ SẢN XUẤT', 'GIAO HÀNG TOÀN CẦU', 'DỰ ÁN TIÊU BIỂU'],
    captions: [
      'Toàn cảnh nhà máy', 'Cơ sở sản xuất', 'Sản xuất tự động', 'Sản xuất thang cuốn', 'Lắp ráp cabin', 'Dây chuyền sản xuất hiện đại',
      'Lô hàng xuất khẩu', 'Đóng hàng container', 'Sẵn sàng giao hàng', 'Vận chuyển quốc tế', 'Chuẩn bị giao hàng', 'Xuất hàng từ nhà máy',
      'Dự án tổ hợp đô thị', 'Dự án khuôn viên Alibaba', 'Dự án công nghiệp CATL', 'Nhà khách Nhà nước Campuchia', 'Dự án nhà ở cao tầng', 'Dự án khu công nghiệp Việt Nam', 'Đại học Al-Noor, Iraq', 'Dự án biểu tượng Glory Dome Nigeria',
    ],
  },
  km: {
    heading: 'ការផលិត ការដឹកជញ្ជូនសកល និងគម្រោង',
    sections: ['រោងចក្រ និងការផលិត', 'ការដឹកជញ្ជូនសកល', 'គម្រោងសំខាន់ៗ'],
    captions: [
      'ទិដ្ឋភាពទូទៅនៃរោងចក្រ', 'បរិក្ខារផលិតកម្ម', 'ការផលិតស្វ័យប្រវត្តិ', 'ការផលិតជណ្តើរយន្ត', 'ការដំឡើងកាប៊ីន', 'ខ្សែសង្វាក់ផលិតកម្មទំនើប',
      'ការដឹកជញ្ជូននាំចេញ', 'ការផ្ទុកកុងតឺន័រ', 'ត្រៀមដឹកជញ្ជូន', 'ការដឹកជញ្ជូនអន្តរជាតិ', 'ការរៀបចំដឹកជញ្ជូន', 'ការដឹកចេញពីរោងចក្រ',
      'គម្រោងអគារចម្រុះក្នុងទីក្រុង', 'គម្រោងបរិវេណ Alibaba', 'គម្រោងឧស្សាហកម្ម CATL', 'វិមានទទួលភ្ញៀវរដ្ឋកម្ពុជា', 'គម្រោងលំនៅឋានខ្ពស់', 'គម្រោងសួនឧស្សាហកម្មវៀតណាម', 'សាកលវិទ្យាល័យ Al-Noor អ៊ីរ៉ាក់', 'គម្រោងសំណង់សម្គាល់ Glory Dome នីហ្សេរីយ៉ា',
    ],
  },
  ar: {
    heading: 'التصنيع والتسليم العالمي والمشاريع',
    sections: ['المصنع والتصنيع', 'التسليم العالمي', 'مشاريع نموذجية'],
    captions: [
      'منظر بانورامي للمصنع', 'منشأة الإنتاج', 'التصنيع الآلي', 'إنتاج السلالم المتحركة', 'تجميع الكبائن', 'خط إنتاج حديث',
      'شحنة تصدير', 'تحميل الحاويات', 'جاهز للشحن', 'الشحن الدولي', 'تحضير الشحنة', 'الشحن من المصنع',
      'مشروع مجمع حضري', 'مشروع حرم Alibaba', 'مشروع CATL الصناعي', 'دار ضيافة الدولة في كمبوديا', 'مشروع سكني شاهق', 'مشروع منطقة صناعية في فيتنام', 'جامعة النور، العراق', 'مشروع Glory Dome المعلمي في نيجيريا',
    ],
  },
  ru: {
    heading: 'Производство, глобальные поставки и проекты',
    sections: ['ЗАВОД И ПРОИЗВОДСТВО', 'ГЛОБАЛЬНЫЕ ПОСТАВКИ', 'ТИПОВЫЕ ПРОЕКТЫ'],
    captions: [
      'Панорама завода', 'Производственный комплекс', 'Автоматизированное производство', 'Производство эскалаторов', 'Сборка кабин', 'Современная производственная линия',
      'Экспортная отгрузка', 'Загрузка контейнеров', 'Готово к отправке', 'Международная доставка', 'Подготовка к отгрузке', 'Отгрузка с завода',
      'Проект городского комплекса', 'Проект кампуса Alibaba', 'Промышленный проект CATL', 'Государственный гостевой дом Камбоджи', 'Проект высотного жилого комплекса', 'Проект промышленного парка во Вьетнаме', 'Университет Аль-Нур, Ирак', 'Знаковый проект Glory Dome в Нигерии',
    ],
  },
};

const bilingual = (english: string, chinese: string) => `${english} / ${chinese}`;

export const getCompanyShowcaseContent = (language: Lang) => {
  const localized = language === 'zh-en'
    ? {
        heading: bilingual(copy.en.heading, copy.zh.heading),
        sections: copy.en.sections.map((text, index) => bilingual(text, copy.zh.sections[index])) as [string, string, string],
        captions: copy.en.captions.map((text, index) => bilingual(text, copy.zh.captions[index])),
      }
    : copy[language];

  let captionIndex = 0;
  return {
    heading: localized.heading,
    sections: sectionAssets.map((images, sectionIndex) => ({
      number: String(sectionIndex + 1).padStart(2, '0'),
      title: localized.sections[sectionIndex],
      images: images.map((src) => [src, localized.captions[captionIndex++]] as const),
    })),
  };
};
