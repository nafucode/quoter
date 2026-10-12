// Transcribed from the complete rows in the supplied reference images.
export const dumbwaiterParts = [
  ['Control Board', 'X-MINI-5V', 'Wuxi Elevator Components Co., Ltd.', 'Wuxi, Jiangsu'],
  ['Control Cabinet', '350mm × 450mm × 180mm', 'Wuxi Shuanglu Electric Machinery Co., Ltd.', 'Wuxi, Jiangsu'],
  ['Main Contactor', 'LC1E09 10', 'Schneider Electric Hubei Manufacturing (Wuhan) Co., Ltd.', 'Wuhan, Hubei'],
  ['Phase Sequence Relay', 'PW', 'Wuxi Elevator Components Co., Ltd.', 'Wuxi, Jiangsu'],
  ['Thermal Relay', 'DZ108-20', 'Zhejiang Chint Electrics Co., Ltd.', 'Yueqing, Zhejiang'],
  ['Circuit Breaker', 'DZ47-60 C6', 'Zhejiang Chint Electrics Co., Ltd.', 'Yueqing, Zhejiang'],
  ['Transformer', 'R-20', 'Shanghai Laidi Electronic Technology Co., Ltd.', 'Shanghai'],
  ['Guide Rails', 'TK3A', 'Huzhou Oulia Mechanical & Electrical Technology Co., Ltd.', 'Huzhou, Zhejiang'],
  ['Traction Machine', 'BYJ110', 'Changshu Boshen Industrial Co., Ltd.', 'Changshu, Jiangsu'],
  ['Car', '1.2mm thick 304 stainless steel', 'Zhejiang Geli Elevator Co., Ltd.', 'Huzhou, Zhejiang'],
] as const;

export const dumbwaiterFunctions = [
  ['Electric Lock Function', "The base station call box has a key-operated switch to enable or disable the lift's control circuit."],
  ['Electrical Door Interlock Function', 'Each landing door has an electrical interlock switch. The lift stops if any landing door is open.'],
  ['Mechanical Door Lock Function', 'Each landing door has a mechanical lock to prevent opening when the car is not at that floor. When the car is at the floor, the door can be opened with the special key supplied with the lift.'],
  ['Dual Car Door System', 'Closes tightly automatically, with an electrical interlock to prevent items from tipping or sliding out during transport. Also provides heat retention.'],
  ['Hall Emergency Stop Function', 'Each hall operating panel has an emergency stop switch to stop the lift immediately in an emergency.'],
  ['Piano Wire Rope System', 'Compared with ordinary elevator guide rail systems, this system withstands lateral and longitudinal impact forces, improving operational stability and extending service life.'],
  ['Audible Arrival Alert Function', 'A buzzer sounds when the car arrives to alert the operator.'],
  ['Floor Level Indication Function', 'The car position is displayed on a digital screen.'],
  ['Travel Direction Display Function', 'Illuminated up/down arrows indicate the direction of travel.'],
  ['Automatic Leveling Function', 'If the car does not stop level at a landing, the system automatically moves it to the level position at that landing.'],
  ['Upper/Lower Limit Final Protection', 'Prevents potential malfunctions if the lift loses control, enhancing safety.'],
  ['Power Failure & Phase Reversal Protection', 'Protects the traction machine or prevents reverse operation if the three-phase power supply connections are incorrect.'],
  ['10-Second Timeout Function', 'If the lift cannot complete its movement, the relay automatically stops it after 10 seconds to prevent motor damage.'],
  ['Anti-Sticking Protection Function', 'Prevents unintended lift stops caused by components such as contactors failing to release.'],
] as const;

export const dumbwaiterConfigurationTitle = 'Dumbwaiter Lift - Main Components & Basic Functions';

export function dumbwaiterConfigurationRows(parts: boolean, functions: boolean) {
  return [
    ...(parts ? dumbwaiterParts.map(([name, model, manufacturer, origin], index) => ({
      section: 'Main Components', number: index + 1, name,
      details: `Model / Specification: ${model}\nManufacturer: ${manufacturer}\nOrigin: ${origin}`,
    })) : []),
    ...(functions ? dumbwaiterFunctions.map(([name, details], index) => ({
      section: 'Basic Functions', number: index + 1, name, details,
    })) : []),
  ];
}
