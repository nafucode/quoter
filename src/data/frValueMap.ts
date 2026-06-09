/**
 * Elevator domain value translations: English -> French
 * Ordered from most-specific to most-general to avoid partial-match conflicts.
 * Each entry is [RegExp, replacement].
 */
export const FR_VALUE_MAP: [RegExp, string][] = [
  // Elevator type
  [/passenger\s*lift/gi, 'Ascenseur passagers'],
  [/passenger\s*elevator/gi, 'Ascenseur passagers'],
  [/freight\s*elevator/gi, 'Monte-charge'],
  [/cargo\s*elevator/gi, 'Monte-charge'],
  [/service\s*elevator/gi, 'Ascenseur de service'],
  [/home\s*elevator/gi, 'Ascenseur privatif'],
  [/observation\s*elevator/gi, 'Ascenseur panoramique'],
  [/hospital\s*elevator/gi, 'Ascenseur hospitalier'],
  [/dumbwaiter/gi, 'Monte-plats'],
  [/escalator/gi, 'Escalier mecanique'],

  // Machine room
  [/machine\s*room\s*less/gi, 'Sans local machinerie'],
  [/without\s*machine\s*room/gi, 'Sans local machinerie'],
  [/with\s*machine\s*room/gi, 'Avec local machinerie'],
  [/\bMRL\b/g, 'Sans local machinerie (MRL)'],
  [/\bMR\b/g, 'Avec local machinerie (MR)'],

  // Control system
  [/group\s*control/gi, 'Commande groupee'],
  [/simplex/gi, 'Simplex'],
  [/duplex/gi, 'Duplex'],

  // Drive system
  [/gearless\s*motor\s*[-\u2013]?\s*vvvf/gi, 'Moteur gearless - VVVF'],
  [/geared\s*motor\s*[-\u2013]?\s*vvvf/gi, 'Moteur avec reducteur - VVVF'],
  [/gearless\s*motor/gi, 'Moteur gearless'],
  [/geared\s*motor/gi, 'Moteur avec reducteur'],
  [/hydraulic/gi, 'Hydraulique'],
  [/\bVVVF\b/g, 'VVVF'],

  // Shaft construction
  [/concrete/gi, 'Beton'],
  [/brick/gi, 'Brique'],
  [/steel\s*structure/gi, 'Structure acier'],
  [/glass\s*shaft/gi, 'Gaine vitree'],

  // Entrances
  [/single\s*entrance/gi, 'Entree simple'],
  [/double\s*entrance/gi, 'Double entree'],
  [/through\s*(car|entrance)/gi, 'Traversant'],
  [/front\s*and\s*rear/gi, 'Entree avant et arriere'],

  // Power / frequency
  [/three[-\s]*phase/gi, 'triphase'],
  [/single[-\s]*phase/gi, 'monophase'],
  [/3\s*phase/gi, 'triphase'],
  [/1\s*phase/gi, 'monophase'],
  [/50\s*hz/gi, '50 Hz'],
  [/60\s*hz/gi, '60 Hz'],

  // Door opening type
  [/center\s*opening/gi, 'Ouverture centrale'],
  [/centre\s*opening/gi, 'Ouverture centrale'],
  [/side\s*opening/gi, 'Ouverture laterale'],
  [/rear\s*opening/gi, 'Ouverture arriere'],
  [/2\s*co\b/gi, 'Ouverture centrale 2 vantaux'],
  [/4\s*co\b/gi, 'Ouverture centrale 4 vantaux'],

  // Door header
  [/standard/gi, 'Standard'],
  [/custom/gi, 'Personnalise'],

  // Surface finishes
  [/mirror\s*stainless\s*steel\s*304/gi, 'Acier inoxydable miroir 304'],
  [/hairline\s*stainless\s*steel\s*304\s*(\d+\.?\d*)\s*mm/gi, 'Acier inoxydable brosse 304 $1mm'],
  [/hairline\s*stainless\s*steel\s*304/gi, 'Acier inoxydable brosse 304'],
  [/mirror\s*stainless\s*steel/gi, 'Acier inoxydable miroir'],
  [/hairline\s*stainless\s*steel/gi, 'Acier inoxydable brosse'],
  [/etched\s*stainless\s*steel/gi, 'Acier inoxydable grave'],
  [/embossed\s*stainless\s*steel/gi, 'Acier inoxydable embouti'],
  [/stainless\s*steel/gi, 'Acier inoxydable'],
  [/titanium\s*gold/gi, 'Or titane'],
  [/rose\s*gold/gi, 'Or rose'],
  [/champagne\s*gold/gi, 'Or champagne'],
  [/champagne/gi, 'Champagne'],
  [/titanium/gi, 'Titane'],
  [/bronze/gi, 'Bronze'],
  [/brown\s*hairline/gi, 'Brosse brun'],
  [/\bbrown\b/gi, 'Brun'],
  [/\bgold\b/gi, 'Or'],
  [/\bsilver\b/gi, 'Argente'],
  [/\bblack\b/gi, 'Noir'],
  [/\bwhite\b/gi, 'Blanc'],

  // Ceiling / light
  [
    /mirror\s*stainless\s*steel\s*frame,?\s*acrylic\s*light\s*decoration,?\s*led\s*light/gi,
    'Cadre en acier inoxydable miroir, decoration lumineuse acrylique, eclairage LED',
  ],
  [/acrylic\s*light\s*decoration/gi, 'Decoration lumineuse acrylique'],
  [/led\s*light/gi, 'Eclairage LED'],
  [/fluorescent/gi, 'Fluorescent'],
  [/downlight/gi, 'Spot encastre'],
  [/as\s*picture/gi, 'Comme sur la photo'],

  // Floor materials
  [/\bpvc\b/gi, 'Sol PVC'],
  [/marble/gi, 'Marbre'],
  [/granite/gi, 'Granit'],
  [/laminate/gi, 'Stratifie'],
  [/wooden/gi, 'Bois'],
  [/carpet/gi, 'Moquette'],

  // Handrail
  [/round\s*type/gi, 'Type rond'],
  [/flat\s*type/gi, 'Type plat'],
  [/square\s*type/gi, 'Type carre'],
  [/(\d+)\s*pcs?\b/gi, '$1 pcs'],

  // COP/LOP
  [/round\s*standard/gi, 'Bouton rond standard'],
  [/square\s*standard/gi, 'Bouton carre standard'],

  // Optional / included
  [/not\s*included/gi, 'Non inclus'],
  [/optional/gi, 'Optionnel'],
  [/included/gi, 'Inclus'],

  // Functions
  [/automatic\s*rescue\s*device\s*\(?ard\)?/gi, 'Dispositif de secours automatique (ARD)'],
  [/\bard\b/gi, 'Dispositif de secours automatique (ARD)'],
  [/full\s*collective\s*control/gi, 'Commande collective complete'],
  [/emergency\s*light/gi, 'Eclairage de secours'],
  [/intercom\s*system/gi, 'Systeme interphone'],
  [/\bcctv\b/gi, 'CCTV'],
  [/air\s*conditioner/gi, 'Climatisation'],
  [/ventilation\s*fan/gi, 'Ventilateur'],
  [/background\s*music/gi, "Musique d'ambiance"],
  [/card\s*reader/gi, 'Lecteur de carte'],
  [/overload\s*(protection|device)?/gi, 'Protection contre la surcharge'],
  [/anti[-\s]*nuisance/gi, 'Fonction anti-abus'],
  [/fireman'?s?\s*(service|operation)?/gi, 'Service pompier'],
  [/earthquake\s*(sensor|detection)?/gi, 'Capteur sismique'],
  [/remote\s*monitoring/gi, 'Surveillance a distance'],
  [/regenerative\s*drive/gi, 'Variateur regeneratif'],
];

/**
 * Translate a single value string using the elevator domain map (English -> French).
 * Unknown terms are left unchanged.
 */
export function translateValueToFr(value: string): string {
  let result = String(value);
  for (const [pattern, replacement] of FR_VALUE_MAP) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
