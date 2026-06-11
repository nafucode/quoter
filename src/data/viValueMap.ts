/**
 * Elevator domain value translations: English -> Vietnamese
 * Ordered from most-specific to most-general to avoid partial-match conflicts.
 * Each entry is [RegExp, replacement].
 */
export const VI_VALUE_MAP: [RegExp, string][] = [
  // Elevator type
  [/passenger\s*lift/gi, 'Thang máy chở khách'],
  [/passenger\s*elevator/gi, 'Thang máy chở khách'],
  [/freight\s*elevator/gi, 'Thang máy chở hàng'],
  [/cargo\s*elevator/gi, 'Thang máy chở hàng'],
  [/service\s*elevator/gi, 'Thang máy dịch vụ'],
  [/home\s*elevator/gi, 'Thang máy gia đình'],
  [/observation\s*elevator/gi, 'Thang máy quan sát'],
  [/hospital\s*elevator/gi, 'Thang máy bệnh viện'],
  [/dumbwaiter/gi, 'Thang tải thực phẩm'],
  [/escalator/gi, 'Thang cuốn'],

  // Machine room
  [/machine\s*room\s*less/gi, 'Không phòng máy'],
  [/without\s*machine\s*room/gi, 'Không phòng máy'],
  [/with\s*machine\s*room/gi, 'Có phòng máy'],
  [/\bMRL\b/g, 'Không phòng máy (MRL)'],
  [/\bMR\b/g, 'Có phòng máy (MR)'],

  // Control system
  [/group\s*control/gi, 'Điều khiển nhóm'],
  [/simplex/gi, 'Điều khiển đơn'],
  [/duplex/gi, 'Điều khiển đôi'],

  // Drive system
  [/gearless\s*motor\s*[-\u2013]?\s*vvvf/gi, 'Động cơ không hộp số - VVVF'],
  [/geared\s*motor\s*[-\u2013]?\s*vvvf/gi, 'Động cơ có hộp số - VVVF'],
  [/gearless\s*motor/gi, 'Động cơ không hộp số'],
  [/geared\s*motor/gi, 'Động cơ có hộp số'],
  [/hydraulic/gi, 'Thủy lực'],
  [/\bVVVF\b/g, 'VVVF'],

  // Shaft construction
  [/concrete/gi, 'Bê tông'],
  [/brick/gi, 'Gạch'],
  [/steel\s*structure/gi, 'Kết cấu thép'],
  [/glass\s*shaft/gi, 'Giếng kính'],

  // Entrances
  [/single\s*entrance/gi, 'Một cửa vào'],
  [/double\s*entrance/gi, 'Hai cửa vào'],
  [/through\s*(car|entrance)/gi, 'Thông suốt'],
  [/front\s*and\s*rear/gi, 'Cửa trước và sau'],

  // Power / frequency
  [/three[-\s]*phase/gi, '3 pha'],
  [/single[-\s]*phase/gi, '1 pha'],
  [/3\s*phase/gi, '3 pha'],
  [/1\s*phase/gi, '1 pha'],
  [/50\s*hz/gi, '50 Hz'],
  [/60\s*hz/gi, '60 Hz'],

  // Door opening type
  [/center\s*opening/gi, 'Mở tim'],
  [/centre\s*opening/gi, 'Mở tim'],
  [/side\s*opening/gi, 'Mở lùa'],
  [/rear\s*opening/gi, 'Mở phía sau'],
  [/2\s*co\b/gi, 'Mở tim 2 cánh'],
  [/4\s*co\b/gi, 'Mở tim 4 cánh'],

  // Door header
  [/standard/gi, 'Tiêu chuẩn'],
  [/custom/gi, 'Tùy chỉnh'],

  // Surface finishes
  [/mirror\s*stainless\s*steel\s*304/gi, 'Inox gương 304'],
  [/hairline\s*stainless\s*steel\s*304\s*(\d+\.?\d*)\s*mm/gi, 'Inox sọc nhuyễn 304 $1mm'],
  [/hairline\s*stainless\s*steel\s*304/gi, 'Inox sọc nhuyễn 304'],
  [/mirror\s*stainless\s*steel/gi, 'Inox gương'],
  [/hairline\s*stainless\s*steel/gi, 'Inox sọc nhuyễn'],
  [/etched\s*stainless\s*steel/gi, 'Inox ăn mòn hoa văn'],
  [/embossed\s*stainless\s*steel/gi, 'Inox dập nổi'],
  [/stainless\s*steel/gi, 'Inox'],
  [/titanium\s*gold/gi, 'Vàng titan'],
  [/rose\s*gold/gi, 'Vàng hồng'],
  [/champagne\s*gold/gi, 'Vàng champagne'],
  [/champagne/gi, 'Champagne'],
  [/titanium/gi, 'Titan'],
  [/bronze/gi, 'Đồng'],
  [/brown\s*hairline/gi, 'Sọc nhuyễn nâu'],
  [/\bbrown\b/gi, 'Nâu'],
  [/\bgold\b/gi, 'Vàng'],
  [/\bsilver\b/gi, 'Bạc'],
  [/\bblack\b/gi, 'Đen'],
  [/\bwhite\b/gi, 'Trắng'],

  // Ceiling / light
  [
    /mirror\s*stainless\s*steel\s*frame,?\s*acrylic\s*light\s*decoration,?\s*led\s*light/gi,
    'Khung inox gương, trang trí đèn acrylic, đèn LED',
  ],
  [/acrylic\s*light\s*decoration/gi, 'Trang trí đèn acrylic'],
  [/led\s*light/gi, 'Đèn LED'],
  [/fluorescent/gi, 'Đèn huỳnh quang'],
  [/downlight/gi, 'Đèn downlight'],
  [/as\s*picture/gi, 'Như hình'],

  // Floor materials
  [/\bpvc\b/gi, 'Sàn PVC'],
  [/marble/gi, 'Đá marble'],
  [/granite/gi, 'Đá granite'],
  [/laminate/gi, 'Laminate'],
  [/wooden/gi, 'Gỗ'],
  [/carpet/gi, 'Thảm'],

  // Handrail
  [/round\s*type/gi, 'Loại tròn'],
  [/flat\s*type/gi, 'Loại phẳng'],
  [/square\s*type/gi, 'Loại vuông'],
  [/(\d+)\s*pcs?\b/gi, '$1 cái'],

  // COP/LOP
  [/round\s*standard/gi, 'Nút tròn tiêu chuẩn'],
  [/square\s*standard/gi, 'Nút vuông tiêu chuẩn'],

  // Optional / included
  [/not\s*included/gi, 'Không bao gồm'],
  [/optional/gi, 'Tùy chọn'],
  [/included/gi, 'Bao gồm'],

  // Functions
  [/automatic\s*rescue\s*device\s*\(?ard\)?/gi, 'Thiết bị cứu hộ tự động (ARD)'],
  [/\bard\b/gi, 'Thiết bị cứu hộ tự động (ARD)'],
  [/full\s*collective\s*control/gi, 'Điều khiển tập hợp đầy đủ'],
  [/emergency\s*light/gi, 'Đèn khẩn cấp'],
  [/intercom\s*system/gi, 'Hệ thống intercom'],
  [/\bcctv\b/gi, 'CCTV'],
  [/air\s*conditioner/gi, 'Điều hòa'],
  [/ventilation\s*fan/gi, 'Quạt thông gió'],
  [/background\s*music/gi, 'Nhạc nền'],
  [/card\s*reader/gi, 'Đầu đọc thẻ'],
  [/overload\s*(protection|device)?/gi, 'Bảo vệ quá tải'],
  [/anti[-\s]*nuisance/gi, 'Chức năng chống phá rối'],
  [/fireman'?s?\s*(service|operation)?/gi, 'Chế độ cứu hỏa'],
  [/earthquake\s*(sensor|detection)?/gi, 'Cảm biến động đất'],
  [/remote\s*monitoring/gi, 'Giám sát từ xa'],
  [/regenerative\s*drive/gi, 'Biến tần tái sinh'],
];

/**
 * Translate a single value string using the elevator domain map (English -> Vietnamese).
 * Unknown terms are left unchanged.
 */
export function translateValueToVi(value: string): string {
  let result = String(value);
  for (const [pattern, replacement] of VI_VALUE_MAP) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
