/**
 * Elevator domain value translations: English → Spanish
 * Ordered from most-specific to most-general to avoid partial-match conflicts.
 * Each entry is [RegExp, replacement].
 */
export const ES_VALUE_MAP: [RegExp, string][] = [

  // ── Elevator type ──────────────────────────────────────────────────────────
  [/passenger\s*lift/gi,         'Ascensor de pasajeros'],
  [/passenger\s*elevator/gi,     'Ascensor de pasajeros'],
  [/freight\s*elevator/gi,       'Montacargas'],
  [/cargo\s*elevator/gi,         'Montacargas'],
  [/service\s*elevator/gi,       'Ascensor de servicio'],
  [/home\s*elevator/gi,          'Ascensor residencial'],
  [/observation\s*elevator/gi,   'Ascensor panorámico'],
  [/hospital\s*elevator/gi,      'Ascensor hospitalario'],
  [/dumbwaiter/gi,               'Montaplatos'],
  [/escalator/gi,                'Escalera mecánica'],

  // ── Machine room ───────────────────────────────────────────────────────────
  [/machine\s*room\s*less/gi,    'Sin cuarto de máquinas'],
  [/without\s*machine\s*room/gi, 'Sin cuarto de máquinas'],
  [/with\s*machine\s*room/gi,    'Con cuarto de máquinas'],
  [/\bMRL\b/g,                   'Sin cuarto de máquinas (MRL)'],
  [/\bMR\b/g,                    'Con cuarto de máquinas (MR)'],

  // ── Control system ─────────────────────────────────────────────────────────
  [/group\s*control/gi,          'Control en grupo'],
  [/simplex/gi,                  'Control individual'],
  [/duplex/gi,                   'Control dúplex'],

  // ── Drive system ───────────────────────────────────────────────────────────
  [/gearless\s*motor\s*[-–]?\s*vvvf/gi, 'Motor sin engranaje - VVVF'],
  [/geared\s*motor\s*[-–]?\s*vvvf/gi,   'Motor con engranaje - VVVF'],
  [/gearless\s*motor/gi,         'Motor sin engranaje'],
  [/geared\s*motor/gi,           'Motor con engranaje'],
  [/hydraulic/gi,                'Hidráulico'],
  [/\bVVVF\b/g,                  'Variador de frecuencia (VVVF)'],

  // ── Shaft construction ─────────────────────────────────────────────────────
  [/concrete/gi,                 'Hormigón'],
  [/brick/gi,                    'Ladrillo'],
  [/steel\s*structure/gi,        'Estructura metálica'],
  [/glass\s*shaft/gi,            'Foso de vidrio'],

  // ── Entrances ──────────────────────────────────────────────────────────────
  [/single\s*entrance/gi,        'Entrada simple'],
  [/double\s*entrance/gi,        'Entrada doble'],
  [/through\s*(car|entrance)/gi, 'Pasante'],
  [/front\s*and\s*rear/gi,       'Entrada y salida opuestas'],

  // ── Power / frequency ──────────────────────────────────────────────────────
  [/three[-\s]*phase/gi,         'Trifásico'],
  [/single[-\s]*phase/gi,        'Monofásico'],
  [/3\s*phase/gi,                'Trifásico'],
  [/1\s*phase/gi,                'Monofásico'],
  [/50\s*hz/gi,                  '50 Hz'],
  [/60\s*hz/gi,                  '60 Hz'],

  // ── Door opening type ──────────────────────────────────────────────────────
  [/center\s*opening/gi,         'Apertura central'],
  [/centre\s*opening/gi,         'Apertura central'],
  [/side\s*opening/gi,           'Apertura lateral'],
  [/rear\s*opening/gi,           'Apertura trasera'],
  [/2\s*co\b/gi,                 'Central 2 hojas'],
  [/4\s*co\b/gi,                 'Central 4 hojas'],

  // ── Door header ────────────────────────────────────────────────────────────
  [/standard/gi,                 'Estándar'],
  [/custom/gi,                   'Personalizado'],

  // ── Surface finishes ───────────────────────────────────────────────────────
  [/mirror\s*stainless\s*steel\s*304/gi, 'Acero inoxidable 304 espejo'],
  [/hairline\s*stainless\s*steel\s*304\s*(\d+\.?\d*)\s*mm/gi, 'Acero inox. 304 satinado $1mm'],
  [/hairline\s*stainless\s*steel\s*304/gi, 'Acero inox. 304 satinado'],
  [/mirror\s*stainless\s*steel/gi, 'Acero inoxidable espejo'],
  [/hairline\s*stainless\s*steel/gi, 'Acero inoxidable satinado'],
  [/etched\s*stainless\s*steel/gi, 'Acero inoxidable grabado'],
  [/embossed\s*stainless\s*steel/gi, 'Acero inoxidable repujado'],
  [/stainless\s*steel/gi,        'Acero inoxidable'],
  [/titanium\s*gold/gi,          'Dorado titanio'],
  [/rose\s*gold/gi,              'Oro rosa'],
  [/champagne\s*gold/gi,         'Dorado champán'],
  [/champagne/gi,                'Champán'],
  [/titanium/gi,                 'Titanio'],
  [/bronze/gi,                   'Bronce'],
  [/brown\s*hairline/gi,         'Satinado marrón'],
  [/\bbrown\b/gi,                'Marrón'],
  [/\bgold\b/gi,                 'Dorado'],
  [/\bsilver\b/gi,               'Plateado'],
  [/\bblack\b/gi,                'Negro'],
  [/\bwhite\b/gi,                'Blanco'],

  // ── Ceiling / light ────────────────────────────────────────────────────────
  [/mirror\s*stainless\s*steel\s*frame,?\s*acrylic\s*light\s*decoration,?\s*led\s*light/gi,
    'Marco acero inox. espejo, caja de luz acrílica, luz LED'],
  [/acrylic\s*light\s*decoration/gi, 'Decoración luminosa acrílica'],
  [/led\s*light/gi,              'Luz LED'],
  [/fluorescent/gi,              'Fluorescente'],
  [/downlight/gi,                'Downlight'],
  [/as\s*picture/gi,             'Según imagen'],

  // ── Floor materials ────────────────────────────────────────────────────────
  [/\bpvc\b/gi,                  'Suelo PVC'],
  [/marble/gi,                   'Mármol'],
  [/granite/gi,                  'Granito'],
  [/laminate/gi,                 'Laminado'],
  [/wooden/gi,                   'Madera'],
  [/carpet/gi,                   'Moqueta'],

  // ── Handrail ───────────────────────────────────────────────────────────────
  [/round\s*type/gi,             'Tipo redondo'],
  [/flat\s*type/gi,              'Tipo plano'],
  [/square\s*type/gi,            'Tipo cuadrado'],
  [/(\d+)\s*pcs?\b/gi,           '$1 ud.'],

  // ── COP/LOP ────────────────────────────────────────────────────────────────
  [/round\s*standard/gi,         'Botón redondo estándar'],
  [/square\s*standard/gi,        'Botón cuadrado estándar'],

  // ── Optional / included ────────────────────────────────────────────────────
  [/not\s*included/gi,           'No incluido'],
  [/optional/gi,                 'Opcional'],
  [/included/gi,                 'Incluido'],

  // ── Functions ──────────────────────────────────────────────────────────────
  [/automatic\s*rescue\s*device\s*\(?ard\)?/gi, 'Dispositivo de rescate automático (ARD)'],
  [/\bard\b/gi,                  'Dispositivo de rescate automático (ARD)'],
  [/full\s*collective\s*control/gi, 'Control colectivo completo'],
  [/emergency\s*light/gi,        'Luz de emergencia'],
  [/intercom\s*system/gi,        'Sistema de intercomunicación'],
  [/\bcctv\b/gi,                 'Circuito cerrado CCTV'],
  [/air\s*conditioner/gi,        'Aire acondicionado'],
  [/ventilation\s*fan/gi,        'Ventilador'],
  [/background\s*music/gi,       'Música ambiental'],
  [/card\s*reader/gi,            'Lector de tarjetas'],
  [/overload\s*(protection|device)?/gi, 'Protección de sobrecarga'],
  [/anti[-\s]*nuisance/gi,       'Función anti-vandalismo'],
  [/fireman'?s?\s*(service|operation)?/gi, 'Servicio de bomberos'],
  [/earthquake\s*(sensor|detection)?/gi, 'Sensor sísmico'],
  [/remote\s*monitoring/gi,      'Monitoreo remoto'],
  [/regenerative\s*drive/gi,     'Variador regenerativo'],
];

/**
 * Translate a single value string using the elevator domain map (English → Spanish).
 * Unknown terms are left unchanged.
 */
export function translateValueToEs(value: string): string {
  let result = String(value);
  for (const [pattern, replacement] of ES_VALUE_MAP) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
