export type CountryOption = {
  value: string;
  label: string;
};

export type CountryGroup = {
  group: string;
  options: CountryOption[];
};

const africaCountries: CountryOption[] = [
  { value: 'Algeria', label: 'Algeria 阿尔及利亚' },
  { value: 'Angola', label: 'Angola 安哥拉' },
  { value: 'Benin', label: 'Benin 贝宁' },
  { value: 'Botswana', label: 'Botswana 博茨瓦纳' },
  { value: 'Cameroon', label: 'Cameroon 喀麦隆' },
  { value: "Cote d'Ivoire", label: "Cote d'Ivoire 科特迪瓦" },
  { value: 'Djibouti', label: 'Djibouti 吉布提' },
  { value: 'Democratic Republic of the Congo', label: 'Democratic Republic of the Congo 刚果金' },
  { value: 'Egypt', label: 'Egypt 埃及' },
  { value: 'Ethiopia', label: 'Ethiopia 埃塞俄比亚' },
  { value: 'Ghana', label: 'Ghana 加纳' },
  { value: 'Guinea', label: 'Guinea 几内亚' },
  { value: 'Kenya', label: 'Kenya 肯尼亚' },
  { value: 'Libya', label: 'Libya 利比亚' },
  { value: 'Mali', label: 'Mali 马里' },
  { value: 'Mauritius', label: 'Mauritius 毛里求斯' },
  { value: 'Morocco', label: 'Morocco 摩洛哥' },
  { value: 'Mozambique', label: 'Mozambique 莫桑比克' },
  { value: 'Namibia', label: 'Namibia 纳米比亚' },
  { value: 'Nigeria', label: 'Nigeria 尼日利亚' },
  { value: 'Rwanda', label: 'Rwanda 卢旺达' },
  { value: 'Senegal', label: 'Senegal 塞内加尔' },
  { value: 'Seychelles', label: 'Seychelles 塞舌尔' },
  { value: 'Sierra Leone', label: 'Sierra Leone 塞拉利昂' },
  { value: 'Somalia', label: 'Somalia 索马里' },
  { value: 'South Africa', label: 'South Africa 南非' },
  { value: 'Tanzania', label: 'Tanzania 坦桑尼亚' },
  { value: 'Uganda', label: 'Uganda 乌干达' },
  { value: 'Zambia', label: 'Zambia 赞比亚' },
  { value: 'Zimbabwe', label: 'Zimbabwe 津巴布韦' },
];

const asiaCountries: CountryOption[] = [
  { value: 'Afghanistan', label: 'Afghanistan 阿富汗' },
  { value: 'Bangladesh', label: 'Bangladesh 孟加拉国' },
  { value: 'Cambodia', label: 'Cambodia 柬埔寨' },
  { value: 'Indonesia', label: 'Indonesia 印度尼西亚' },
  { value: 'Iraq', label: 'Iraq 伊拉克' },
  { value: 'Lebanon', label: 'Lebanon 黎巴嫩' },
  { value: 'Kazakhstan', label: 'Kazakhstan 哈萨克斯坦' },
  { value: 'Kyrgyzstan', label: 'Kyrgyzstan 吉尔吉斯斯坦' },
  { value: 'Malaysia', label: 'Malaysia 马来西亚' },
  { value: 'Mongolia', label: 'Mongolia 蒙古' },
  { value: 'Oman', label: 'Oman 阿曼' },
  { value: 'Pakistan', label: 'Pakistan 巴基斯坦' },
  { value: 'Philippines', label: 'Philippines 菲律宾' },
  { value: 'Qatar', label: 'Qatar 卡塔尔' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia 沙特阿拉伯' },
  { value: 'Syria', label: 'Syria 叙利亚' },
  { value: 'Tajikistan', label: 'Tajikistan 塔吉克斯坦' },
  { value: 'Thailand', label: 'Thailand 泰国' },
  { value: 'Vietnam', label: 'Vietnam 越南' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates 阿拉伯联合酋长国' },
];

const europeCountries: CountryOption[] = [
  { value: 'Kosovo', label: 'Kosovo 科索沃' },
  { value: 'Russia', label: 'Russia 俄罗斯' },
  { value: 'Ukraine', label: 'Ukraine 乌克兰' },
];

const northAmericaCountries: CountryOption[] = [
  { value: 'Costa Rica', label: 'Costa Rica 哥斯达黎加' },
  { value: 'El Salvador', label: 'El Salvador 萨尔瓦多' },
  { value: 'Guatemala', label: 'Guatemala 危地马拉' },
  { value: 'Honduras', label: 'Honduras 洪都拉斯' },
  { value: 'Mexico', label: 'Mexico 墨西哥' },
  { value: 'Panama', label: 'Panama 巴拿马' },
];

const southAmericaCountries: CountryOption[] = [
  { value: 'Argentina', label: 'Argentina 阿根廷' },
  { value: 'Brazil', label: 'Brazil 巴西' },
  { value: 'Colombia', label: 'Colombia 哥伦比亚' },
  { value: 'Ecuador', label: 'Ecuador 厄瓜多尔' },
  { value: 'Guyana', label: 'Guyana 圭亚那' },
  { value: 'Paraguay', label: 'Paraguay 巴拉圭' },
  { value: 'Peru', label: 'Peru 秘鲁' },
  { value: 'Venezuela', label: 'Venezuela 委内瑞拉' },
];

const oceaniaCountries: CountryOption[] = [
  { value: 'Australia', label: 'Australia 澳大利亚' },
  { value: 'Papua New Guinea', label: 'Papua New Guinea 巴布亚新几内亚' },
];

const countryByValue = new Map(
  [...africaCountries, ...asiaCountries, ...europeCountries, ...northAmericaCountries, ...southAmericaCountries, ...oceaniaCountries]
    .map((country) => [country.value, country])
);

export const popularCountries: CountryOption[] = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'Ethiopia',
  'Tanzania',
  'Uganda',
  'Cameroon',
  'Senegal',
  'South Africa',
  'Zambia',
  'Zimbabwe',
  'Cambodia',
  'Vietnam',
  'United Arab Emirates',
].map((value) => countryByValue.get(value)).filter(Boolean) as CountryOption[];

export const countryGroups: CountryGroup[] = [
  { group: '常用国家', options: popularCountries },
  { group: '非洲', options: africaCountries },
  { group: '亚洲', options: asiaCountries },
  { group: '欧洲', options: europeCountries },
  { group: '北美洲', options: northAmericaCountries },
  { group: '南美洲', options: southAmericaCountries },
  { group: '大洋洲', options: oceaniaCountries },
];
