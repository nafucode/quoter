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
  ['Electric Lock Function', "The base station call box is equipped with a key-operated switch for enabling and disabling the elevator's control circuit."],
  ['Electrical Door Interlock Function', 'Each landing door is equipped with an electrical interlock switch. The lift will stop running if any landing door is open.'],
  ['Mechanical Door Lock Function', 'Each landing door features a mechanical lock to prevent it from being opened when the car is not at that floor, enhancing safety. If the car is at the floor, the door can be opened using the special key provided with the lift.'],
  ['Dual Car Door System', 'Automatically closes tightly and is equipped with an electrical interlock to prevent items from tipping or sliding out during transport. Also provides heat retention.'],
  ['Hall Emergency Stop Function', 'Each operating panel in the hall is equipped with an emergency stop switch to halt the lift immediately in case of an emergency.'],
  ['Piano Wire Rope System', 'Compared to ordinary elevator guide rail systems, this system can withstand both lateral and longitudinal impact forces, improving operational stability and extending the service life of the lift.'],
  ['Audible Arrival Alert Function', "A buzzer sounds upon the car's arrival to alert the operator, improving usage efficiency."],
  ['Floor Level Indication Function', 'The car position is displayed on a digital screen.'],
  ['Travel Direction Display Function', 'The direction of travel is indicated by illuminated arrows (up/down).'],
  ['Automatic Leveling Function', 'If the car does not stop level at a landing due to any reason, the system will automatically move it to the leveled position at that landing.'],
  ['Upper/Lower Limit Final Protection', 'This device effectively prevents potential malfunctions if the lift loses control, enhancing safety.'],
  ['Power Failure & Phase Reversal Protection', 'Protects the traction machine or prevents the lift from running in reverse if the three-phase power supply connections are incorrect.'],
  ['10-Second Timeout Function', 'If the lift cannot complete its movement for any reason, the relay will automatically stop it after 10 seconds to prevent motor damage.'],
  ['Anti-Sticking Protection Function', 'Prevents unintended lift stops caused by components like contactors failing to release.'],
  ['Floor-Type Electromagnetic Door Knife', 'If the door remains unopened for more than 20 seconds after the car has leveled, the electromagnetic door knife activates via a solenoid valve, allowing the door to be reopened through a hall call command. (Standard for floor-type models)'],
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
