import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Copy } from 'lucide-react';
import { useQuoteStore } from '@/store/useQuoteStore';
import StylePicker from './StylePicker';
import { saveUpload } from '@/utils/localImageLibrary';
import { buildServingFloors, canSyncServingFloors } from '@/utils/servingFloors';
import HybridInput from './HybridInput';
import PriceCalculator from './PriceCalculator';
import { cabinStyleGroups } from '@/data/cabinStyles';
import { copStyleGroups } from '@/data/copStyles';
import { lopStyles } from '@/data/lopStyles';
import { landingDoorStyles } from '@/data/landingDoorStyles';
import { handrailStyles } from '@/data/handrailStyles';
import { logoStyles } from '@/data/logoStyles';
import { floorStyleGroups } from '@/data/floorStyles';

const FUNCTION_PRESETS = [
  { value: 'Accessible Car Operating Panel', label: '残疾人操纵箱' },
  { value: 'IC Card Access (30 IC Cards)', label: 'IC 卡门禁（配 30 张卡）' },
  { value: 'Cabin Air Conditioner', label: '轿厢空调' },
  { value: '4G IoT Elevator Monitoring System', label: '4G 物联网管理系统' },
  { value: 'CCTV Camera', label: '监控（带摄像头）' },
  { value: 'CCTV Interface Only', label: '监控（仅预留接口）' },
  { value: 'Firefighter Elevator Function Package', label: '消防电梯功能包' },
  { value: 'Card Reader (Only provide Contact)', label: '读卡器（仅提供触点）' },
  { value: 'CCTV Camera (Support Analog Camera, provide Contacts at Car Top and Controller)', label: 'CCTV 监控（支持模拟摄像头，仅在轿顶和控制柜提供触点）' },
  { value: 'Building Manager System (BMS) (Only provide Contact)', label: '楼宇管理系统 BMS（仅提供触点）' },
];

const DOOR_OPENING_TYPE_OPTIONS = [
  { value: 'Center Opening', label: 'Center Opening' },
  { value: 'Side Opening', label: 'Side Opening' },
  { value: 'Center Opening 4 Panels', label: 'Center Opening 4 Panels / 4CO 中分双折' },
  { value: 'Swing Door', label: 'Swing Door（平开门）' },
  { value: 'Manual Door', label: 'Manual Door（手拉门）' },
  { value: 'Single Swing Door', label: 'Single Swing Door（单扇平开门）' },
];

const ENTRANCE_OPTIONS = [
  'Single Entrance',
  'Double Entrance',
  'Front & Rear Entrance (Through Loading)',
  'Front & Side Entrance (90°)',
  'Front & Left Side Entrance (90°)',
  'Front & Right Side Entrance (90°)',
];

const SHAFT_CONSTRUCTION_OPTIONS = [
  { value: 'Concrete', label: 'Concrete 混凝土' },
  { value: 'Concrete and Brick', label: 'Concrete and Brick 混凝土和砖墙' },
  { value: 'Steel Structure', label: 'Steel Structure 钢结构（客梯）' },
  { value: 'Bent Steel Plate', label: 'Bent Steel Plate 钢板折弯' },
  { value: 'Aluminum', label: 'Aluminum 铝合金' },
];

const CAR_FLOOR_OPTIONS = [
  { label: 'Marble', value: 'Marble' },
  { label: 'Sintered Slab 岩板', value: 'Sintered Slab' },
  { label: 'Recess 30mm 预留 30mm，客户自理', value: 'Recess 30mm, provided by customer' },
  { label: 'Checkered Steel Plate 花纹钢板', value: 'Checkered Steel Plate' },
];

const DESCRIPTION_OPTIONS = [
  'Passenger Lift',
  'Home Lift',
  'Freight/Cargo Lift',
  'Service Lift',
  'Dumbwaiter Lift',
  'Platform Lift',
];

const isNoneText = (value: unknown) => String(value ?? '').trim().toLowerCase() === 'none';

const ElevatorForm = ({ elevator, onSectionFocus, documentMode = 'quotation', country = '', showCommercialFields = false }: { elevator: any, onSectionFocus: (section: string) => void, documentMode?: 'quotation' | 'proposal', country?: string, showCommercialFields?: boolean }) => {
  const { elevators, updateElevator, removeElevator, toggleElevatorCollapse, moveElevator, duplicateElevator } = useQuoteStore();
  const elevatorIndex = elevators.findIndex(item => item.id === elevator.id);
  const [pickerState, setPickerState] = useState({ isOpen: false, type: '' });
  const [isDoorOpeningMenuOpen, setIsDoorOpeningMenuOpen] = useState(false);
  const proposalCabinCount = Math.min(3, Math.max(1, Number(elevator.proposalCabinCount) || (elevator.showThreeCabinsInProposal ? 3 : 1)));

  const buildElevatorType = (machineRoom: string, capacity: string | number, speed: string | number, description: string) => {
    const isCargoLift = /freight|cargo/i.test(description);
    const modelPrefix = isCargoLift
      ? (machineRoom === 'MRL' ? 'THJW' : 'THJ')
      : (machineRoom === 'MRL' ? 'TKJW' : 'TKJ');
    return `${modelPrefix}${capacity || ''}/${speed || ''}-VVVF`;
  };

  const generatedType = buildElevatorType(elevator.machineRoom, elevator.capacity, elevator.speed, elevator.description);

  useEffect(() => {
    if (elevator.type !== generatedType) {
      updateElevator(elevator.id, 'type', generatedType);
    }
  }, [elevator.id, elevator.type, generatedType, updateElevator]);

  useEffect(() => {
    const nextServingFloors = buildServingFloors(elevator.floorsStops, country);
    if (
      nextServingFloors &&
      elevator.servingFloors !== nextServingFloors &&
      canSyncServingFloors(elevator.servingFloors, elevator.floorsStops, elevator.servingFloorsManual)
    ) {
      updateElevator(elevator.id, 'servingFloors', nextServingFloors);
    }
  }, [country, elevator.floorsStops, elevator.id, elevator.servingFloors, elevator.servingFloorsManual, updateElevator]);

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateElevator(elevator.id, name, value);
    if (name === 'capacity' || name === 'speed') {
      const nextElevator = { ...elevator, [name]: value };
      updateElevator(elevator.id, 'type', buildElevatorType(nextElevator.machineRoom, nextElevator.capacity, nextElevator.speed, nextElevator.description));
    }
  };

  const handleMachineRoomChange = (machineRoom: 'MR' | 'MRL') => {
    updateElevator(elevator.id, 'machineRoom', machineRoom);
    updateElevator(elevator.id, 'type', buildElevatorType(machineRoom, elevator.capacity, elevator.speed, elevator.description));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'servingFloors') updateElevator(elevator.id, 'servingFloorsManual', Boolean(value.trim()));
    updateElevator(elevator.id, name, value);
    if (name === 'description') {
      updateElevator(elevator.id, 'type', buildElevatorType(elevator.machineRoom, elevator.capacity, elevator.speed, value));
    }
    if (name === 'floorsStops') {
      const nextServingFloors = buildServingFloors(value, country);
      const shouldSyncServingFloors =
        canSyncServingFloors(elevator.servingFloors, elevator.floorsStops, elevator.servingFloorsManual);
      if (shouldSyncServingFloors) {
        updateElevator(elevator.id, 'servingFloors', nextServingFloors);
      }
    }
  };

  const handleFunctionChange = (funcId: number, key: string, value: any) => {
    const updatedFunctions = elevator.otherFunctions.map((func: any) => 
      func.id === funcId ? { ...func, [key]: value } : func
    );
    updateElevator(elevator.id, 'otherFunctions', updatedFunctions);
  };

  const handleCarWallChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const wall = name.split('.')[1];
    updateElevator(elevator.id, 'carWall', { ...elevator.carWall, [wall]: value });
  };

  const syncCarFloor = (value: string) => {
    updateElevator(elevator.id, 'carFloor', value);
    updateElevator(elevator.id, 'cabinEffect', {
      ...elevator.cabinEffect,
      floor: { type: 'text', value },
    });
  };

  const handleCabinEffectFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    if (file) {
      e.target.value = '';
      try {
        const image = await saveUpload(file, name);
        const current = useQuoteStore.getState().elevators.find(item => item.id === elevator.id);
        if (!current) return;
        const newCabinEffect = { ...current.cabinEffect, [name]: image.previewImage };
        updateElevator(elevator.id, 'cabinEffect', newCabinEffect);
      } catch (err) { window.alert(err instanceof Error ? err.message : '图片保存失败，请重试。'); }
    }
  };

  const handleCabinEffectHybridChange = (fieldName: string, property: 'type' | 'value', value: any) => {
    const newCabinEffect = {
      ...elevator.cabinEffect,
      [fieldName]: {
        ...elevator.cabinEffect[fieldName],
        [property]: value,
      },
    };
    updateElevator(elevator.id, 'cabinEffect', newCabinEffect);
  };

  const handleHybridTypeChange = (fieldName: string, type: 'text' | 'image') => {
    handleCabinEffectHybridChange(fieldName, 'type', type);
  };

  const handleHybridValueChange = (fieldName: string, value: string) => {
    handleCabinEffectHybridChange(fieldName, 'value', value);
  };

  const handleHybridFileChange = async (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      e.target.value = '';
      try {
        const image = await saveUpload(file, fieldName);
        const current = useQuoteStore.getState().elevators.find(item => item.id === elevator.id);
        if (!current) return;
        updateElevator(elevator.id, 'cabinEffect', { ...current.cabinEffect, [fieldName]: { type: 'image', value: image.previewImage } });
      } catch (err) { window.alert(err instanceof Error ? err.message : '图片保存失败，请重试。'); }
    }
  };

  const selectDoorOpeningType = (value: string) => {
    updateElevator(elevator.id, 'doorOpeningType', value);
    setIsDoorOpeningMenuOpen(false);
  };

  const addFunction = (name = 'New Function') => {
    const existing = elevator.otherFunctions.find((func: any) => func.name.trim().toLowerCase() === name.toLowerCase());
    if (name !== 'New Function' && existing) {
      handleFunctionChange(existing.id, 'checked', true);
      return;
    }
    const id = Math.max(0, ...elevator.otherFunctions.map((func: any) => Number(func.id) || 0)) + 1;
    const newFunction = { id, name, checked: name !== 'New Function' };
    const updatedFunctions = [...elevator.otherFunctions, newFunction];
    updateElevator(elevator.id, 'otherFunctions', updatedFunctions);
  };

  const handleStyleSelect = (style: { id: string; name: string; previewImage: string }) => {
    let newCabinEffect;
    switch (pickerState.type) {
      case 'cabin':
        newCabinEffect = { ...elevator.cabinEffect, cabinImage: style.previewImage, ...(style.id.startsWith('upload-') ? {} : { ceiling: { type: 'text', value: style.id } }) };
        break;
      case 'cabin2':
        newCabinEffect = { ...elevator.cabinEffect, cabinImage2: style.previewImage };
        break;
      case 'cabin3':
        newCabinEffect = { ...elevator.cabinEffect, cabinImage3: style.previewImage };
        break;
      case 'cop':
        newCabinEffect = { ...elevator.cabinEffect, copImage: style.previewImage };
        break;
      case 'lop':
        newCabinEffect = { ...elevator.cabinEffect, lopImage: style.previewImage };
        break;
      case 'landingDoor':
      case 'ceiling':
      case 'button':
        newCabinEffect = { ...elevator.cabinEffect, [pickerState.type]: { type: 'image', value: style.previewImage } };
        break;
      case 'floor':
        newCabinEffect = { ...elevator.cabinEffect, floor: { type: 'image', value: style.previewImage } };
        updateElevator(elevator.id, 'carFloor', style.id.startsWith('upload-') ? style.name : style.id);
        break;
      case 'handrail':
        newCabinEffect = { ...elevator.cabinEffect, handrail: { type: 'image', value: style.previewImage } };
        break;
      case 'copLogo':
        newCabinEffect = { ...elevator.cabinEffect, copLogo: { type: 'image', value: style.previewImage } };
        break;
      default:
        newCabinEffect = { ...elevator.cabinEffect };
    }
    updateElevator(elevator.id, 'cabinEffect', newCabinEffect);
  };

  const openPicker = (type: string) => setPickerState({ isOpen: true, type });

  const getPickerProps = () => {
    switch (pickerState.type) {
      case 'cabin':
      case 'cabin2':
      case 'cabin3': return { styleGroups: cabinStyleGroups, title: 'Choose a Cabin Style' };
      case 'cop': return { styleGroups: copStyleGroups, title: 'Choose a COP Style' };
      case 'lop': return { styleGroups: [{ groupName: 'LOP Styles', styles: lopStyles }], title: 'Choose a LOP Style' };
      case 'landingDoor': return { styleGroups: [{ groupName: 'Landing Door Styles', styles: landingDoorStyles }], title: 'Choose a Landing Door Style' };
      case 'floor': return { styleGroups: floorStyleGroups, title: 'Choose a Floor Style' };
      case 'handrail': return { styleGroups: [{ groupName: 'Handrail Styles', styles: handrailStyles }], title: 'Choose a Handrail Style' };
      case 'copLogo': return { styleGroups: [{ groupName: 'Logo Styles', styles: logoStyles }], title: 'Choose a Logo' };
      case 'ceiling': return { styleGroups: [], title: 'Choose a Ceiling Style' };
      case 'button': return { styleGroups: [], title: 'Choose a Button Style' };
      default: return { styleGroups: [], title: '' };
    }
  };

  return (
    <div className="border-t mt-4 pt-4">
      {pickerState.isOpen && <StylePicker {...getPickerProps()} category={pickerState.type} onSelect={handleStyleSelect} onClose={() => setPickerState({ isOpen: false, type: '' })} />}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <input
          value={elevator.title || `Elevator #L${elevator.id}`}
          onChange={(e) => updateElevator(elevator.id, 'title', e.target.value)}
          className="w-full max-w-xs rounded-md border border-transparent bg-transparent px-2 py-1 text-lg font-semibold focus:border-blue-400 focus:bg-white focus:outline-none"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" title="上移" aria-label="上移" disabled={elevatorIndex <= 0} onClick={() => moveElevator(elevator.id, -1)} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
            <ArrowUp size={18} aria-hidden="true" />
          </button>
          <button type="button" title="下移" aria-label="下移" disabled={elevatorIndex < 0 || elevatorIndex === elevators.length - 1} onClick={() => moveElevator(elevator.id, 1)} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
            <ArrowDown size={18} aria-hidden="true" />
          </button>
          <button type="button" title="复制此台报价" aria-label="复制此台报价" onClick={() => duplicateElevator(elevator.id)} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100">
            <Copy size={18} aria-hidden="true" />
          </button>
          <button onClick={() => toggleElevatorCollapse(elevator.id)} className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 mr-2">
            {elevator.isCollapsed ? 'Expand' : 'Collapse'}
          </button>
          <button onClick={() => removeElevator(elevator.id)} className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600">Remove</button>
        </div>
      </div>
      {!elevator.isCollapsed && (
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Basic Info */}
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4" onFocus={() => onSectionFocus('basic-spec')}>
              <div>
                <label className="block text-sm font-medium text-gray-700" title="Description">描述</label>
                <textarea name="description" value={elevator.description} onChange={handleChange} rows={2} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm resize-y" />
                <select
                  aria-label="Description preset"
                  value={DESCRIPTION_OPTIONS.includes(elevator.description) ? elevator.description : ''}
                  onChange={(e) => {
                    const description = e.target.value;
                    updateElevator(elevator.id, 'description', description);
                    updateElevator(elevator.id, 'type', buildElevatorType(elevator.machineRoom, elevator.capacity, elevator.speed, description));
                  }}
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm"
                >
                  <option value="">选择常用类型 / Select preset</option>
                  {DESCRIPTION_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" title="Machine Room">机房</label>
                <div className="mt-2 flex flex-wrap gap-4 rounded-md border border-gray-200 p-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`machineRoom-${elevator.id}`}
                      value="MR"
                      checked={elevator.machineRoom === 'MR'}
                      onChange={() => handleMachineRoomChange('MR')}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="text-sm">有机房 <span className="font-semibold text-gray-700">MR</span></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`machineRoom-${elevator.id}`}
                      value="MRL"
                      checked={elevator.machineRoom === 'MRL'}
                      onChange={() => handleMachineRoomChange('MRL')}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="text-sm">无机房 <span className="font-semibold text-gray-700">MRL</span></span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" title="Capacity (kg)">载重 (kg)</label>
                <input name="capacity" value={elevator.capacity} onChange={handleBasicChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" title="Speed (m/s)">速度 (m/s)</label>
                <input name="speed" value={elevator.speed} onChange={handleBasicChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" title="Qty">数量</label>
                <input name="qty" value={elevator.qty} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              {(documentMode === 'quotation' || showCommercialFields) && <div>
                <label className="block text-sm font-medium text-gray-700" title="Unit Price">单价</label>
                <input name="unitPrice" value={elevator.unitPrice} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                <PriceCalculator elevator={elevator} />
              </div>}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700" title="Type">类型（根据机房 / 载重 / 速度自动生成）</label>
                <input name="type" value={generatedType} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 shadow-sm" />
              </div>
            </div>

            {/* Specifications */}
            <div className="sm:col-span-2" onFocus={() => onSectionFocus('basic-spec')}>
              <h4 className="text-md font-semibold mt-4 border-b" title="I. Basic specification">基本规格</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Control system">控制系统</label>
                  <select name="controlSystem" value={elevator.controlSystem} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                    <option>Simplex</option>
                    <option>Duplex</option>
                    <option>Group Control</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Floors/Stops/Doors">楼层/站/门</label>
                  <input name="floorsStops" value={elevator.floorsStops} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Serving floors (COP display)">服务楼层</label>
                  <input name="servingFloors" value={elevator.servingFloors} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Entrances">入口</label>
                  <select name="entrances" value={elevator.entrances} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                    {ENTRANCE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option === 'Front & Side Entrance (90°)' ? `${option} / 直角贯通` : option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Power voltage">电源电压</label>
                  <input name="powerVoltage" value={elevator.powerVoltage} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Lighting voltage">照明电压</label>
                  <input name="lightingVoltage" value={elevator.lightingVoltage} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Frequency">频率</label>
                  <input name="frequency" value={elevator.frequency} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700" title="Drive System">驱动系统</label>
                  <input name="driveSystem" value={elevator.driveSystem} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2" onFocus={() => onSectionFocus('hoistway-spec')}>
              <h4 className="text-md font-semibold mt-4 border-b" title="II. Hoistway specification">井道规格</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Shaft construction">井道结构</label>
                  <select name="shaftConstruction" value={elevator.shaftConstruction} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                    {!SHAFT_CONSTRUCTION_OPTIONS.some((option) => option.value === elevator.shaftConstruction) && elevator.shaftConstruction && (
                      <option value={elevator.shaftConstruction}>{elevator.shaftConstruction}（历史值）</option>
                    )}
                    {SHAFT_CONSTRUCTION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Travel (mm)">提升高度 (mm)</label>
                  <input type="text" name="travel" value={elevator.travel} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Headroom (mm)">顶层高度 (mm)</label>
                  <input type="text" name="headroom" value={elevator.headroom} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Pit Depth (mm)">底坑深度 (mm)</label>
                  <input type="text" name="pitDepth" value={elevator.pitDepth} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700" title="Shaft Size (W x D mm)">井道尺寸 (宽 x 深 mm)</label>
                  <input name="shaftSize" value={elevator.shaftSize} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                {elevator.machineRoom === 'MR' && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700" title="Machine Room Size (W x D x H mm)">机房尺寸 (宽 x 深 x 高 mm)</label>
                    <input name="machineRoomSize" value={elevator.machineRoomSize} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-2" onFocus={() => onSectionFocus('car-spec')}>
              <h4 className="text-md font-semibold mt-4 border-b" title="III. Car Specification">轿厢规格</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="COP Plate">操纵盘</label>
                  <input name="copPlate" value={elevator.copPlate} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Car Net Dimension">轿厢净尺寸</label>
                  <input name="carNetDimension" value={elevator.carNetDimension} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Car Ceiling">轿顶</label>
                  <input name="carCeiling" value={elevator.carCeiling} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Car Floor">轿底</label>
                  <select
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white"
                    value=""
                    onChange={(e) => {
                      if (e.target.value) syncCarFloor(e.target.value);
                    }}
                  >
                    <option value="">选择轿底模板</option>
                    {CAR_FLOOR_OPTIONS.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    name="carFloor"
                    value={elevator.carFloor}
                    onChange={(e) => syncCarFloor(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Handrail">扶手</label>
                  <input name="carHandrail" value={elevator.carHandrail} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                  {isNoneText(elevator.carHandrail) && (
                    <label className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={elevator.showNoneHandrailInQuote ?? true}
                        onChange={(e) => updateElevator(elevator.id, 'showNoneHandrailInQuote', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                      />
                      <span>报价单显示 Handrail: None / 显示扶手为空</span>
                    </label>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700" title="Car wall finish">轿壁装饰</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                    <div>
                      <label className="block text-xs font-medium text-gray-500" title="Left wall">左壁</label>
                      <input name="carWall.left" value={elevator.carWall.left} onChange={handleCarWallChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500" title="Right wall">右壁</label>
                      <input name="carWall.right" value={elevator.carWall.right} onChange={handleCarWallChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500" title="Rear wall">后壁</label>
                      <input name="carWall.rear" value={elevator.carWall.rear} onChange={handleCarWallChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2" onFocus={() => onSectionFocus('door-spec')}>
              <h4 className="text-md font-semibold mt-4 border-b" title="IV. Door specification">门规格</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Door Opening Type">开门方式</label>
                  <div
                    className="relative mt-1"
                    onBlur={() => window.setTimeout(() => setIsDoorOpeningMenuOpen(false), 120)}
                  >
                    <input
                      name="doorOpeningType"
                      value={elevator.doorOpeningType}
                      onChange={handleChange}
                      onFocus={() => setIsDoorOpeningMenuOpen(true)}
                      className="block w-full rounded-md border border-gray-300 p-2 pr-10 shadow-sm"
                    />
                    <button
                      type="button"
                      aria-label="Show door opening type options"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => setIsDoorOpeningMenuOpen((isOpen) => !isOpen)}
                      className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-gray-700 hover:bg-gray-100"
                    >
                      <span className="text-lg leading-none">▾</span>
                    </button>
                    {isDoorOpeningMenuOpen && (
                      <div className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                        {DOOR_OPENING_TYPE_OPTIONS.map((option) => (
                          <button
                            type="button"
                            key={option.value}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              selectDoorOpeningType(option.value);
                            }}
                            className="block w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-blue-50"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Door Opening Size (W x H mm)">开门尺寸 (宽 x 高 mm)</label>
                  <input name="doorOpeningSize" value={elevator.doorOpeningSize} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Door Header Type">门头类型</label>
                  <input name="doorHeaderType" value={elevator.doorHeaderType} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">地坎类型</label>
                  <select name="doorSill" value={elevator.doorSill ?? 'Aluminum Alloy'} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                    <option value="Aluminum Alloy">Aluminum Alloy 铝合金</option>
                    <option value="Cast Iron">Cast Iron 铸铁（常用于货梯）</option>
                  </select>
                </div>
                <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={elevator.fireRatedDoors ?? false} onChange={e => updateElevator(elevator.id, 'fireRatedDoors', e.target.checked)} />防火层门</label>
                  {elevator.fireRatedDoors && <><input aria-label="防火等级" list={`fire-ratings-${elevator.id}`} value={elevator.doorFireRating ?? 'E30'} onChange={e => updateElevator(elevator.id, 'doorFireRating', e.target.value)} className="w-36 rounded-md border border-gray-300 p-2" /><datalist id={`fire-ratings-${elevator.id}`}>{['E30', 'E60', 'E120', 'EI30', 'EI60'].map(value => <option key={value} value={value} />)}</datalist></>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Base Floor Door Decoration">基站层门装饰</label>
                  <input name="firstFloorDoor" value={elevator.firstFloorDoor} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Other Floors Door Decoration">其它楼层门装饰</label>
                  <input name="otherFloorsDoor" value={elevator.otherFloorsDoor} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Base Floor Door Jamb">基站层门套</label>
                  <input name="baseFloorJamb" value={elevator.baseFloorJamb ?? 'Standard Narrow Jamb'} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="Other Floors Door Jamb">其它楼层门套</label>
                  <input name="otherFloorsJamb" value={elevator.otherFloorsJamb ?? 'Standard Narrow Jamb'} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2" onFocus={() => onSectionFocus('function-spec')}>
              <h4 className="text-md font-semibold mt-4 border-b" title="V. Function">功能</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700" title="COP/LOP">操纵盘/外呼</label>
                  <input name="copLop" value={elevator.copLop} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700" title="Other Functions">其它功能</label>
                  {elevator.otherFunctions.map((func: any) => (
                    <div key={func.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={func.checked} onChange={(e) => handleFunctionChange(func.id, 'checked', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                      <div className="min-w-0 flex-1">
                        <input aria-label="Function name" type="text" value={func.name} onChange={(e) => handleFunctionChange(func.id, 'name', e.target.value)} className="block w-full p-1 border border-gray-300 rounded-md shadow-sm"/>
                        {FUNCTION_PRESETS.find(option => option.value === func.name)?.label && (
                          <span className="block text-xs text-gray-500">{FUNCTION_PRESETS.find(option => option.value === func.name)?.label}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  <select
                    aria-label="新增常用功能 / Add Function"
                    value=""
                    onChange={(event) => {
                      if (event.target.value) addFunction(event.target.value === 'custom' ? undefined : event.target.value);
                    }}
                    className="mt-2 block w-full min-w-0 rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm"
                  >
                    <option value="">新增功能 / Add Function</option>
                    {FUNCTION_PRESETS.map(option => (
                      <option key={option.value} value={option.value}>{option.label} / {option.value}</option>
                    ))}
                    <option value="custom">自定义功能 / Custom Function</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2" onFocus={() => onSectionFocus('cabin-effect')}>
              <h4 className="text-md font-semibold mt-4 border-b" title="VI. Cabin Effect">效果图</h4>
              {documentMode === 'proposal' && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                  <span className="text-sm font-medium text-gray-700">Cabin options<span className="ml-2 text-xs font-normal text-gray-500">展示轿厢数量</span></span>
                  <div className="flex h-9 items-center overflow-hidden rounded-md border border-gray-300 bg-white" aria-label="Cabin option count">
                    <button
                      type="button"
                      title="Remove cabin option"
                      aria-label="Remove cabin option"
                      disabled={proposalCabinCount <= 1}
                      onClick={() => updateElevator(elevator.id, 'proposalCabinCount', proposalCabinCount - 1)}
                      className="h-9 w-9 text-xl text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                    >−</button>
                    <output className="flex h-9 min-w-10 items-center justify-center border-x border-gray-300 text-sm font-semibold text-gray-800">{proposalCabinCount}</output>
                    <button
                      type="button"
                      title="Add cabin option"
                      aria-label="Add cabin option"
                      disabled={proposalCabinCount >= 3}
                      onClick={() => updateElevator(elevator.id, 'proposalCabinCount', proposalCabinCount + 1)}
                      className="h-9 w-9 text-xl text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                    >+</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{documentMode === 'proposal' ? 'Cabin Image 1' : 'Cabin Image'}<span className="block text-xs text-gray-500">{documentMode === 'proposal' ? '轿厢图片 1' : '轿厢图片'}</span></label>
                  <input type="file" name="cabinImage" onChange={handleCabinEffectFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                  <button onClick={() => openPicker('cabin')} className="mt-2 p-2 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Choose from Library</button>
                </div>
                {documentMode === 'proposal' && proposalCabinCount >= 2 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700" title="Cabin Image 2">轿厢图片 2</label>
                      <input type="file" name="cabinImage2" onChange={handleCabinEffectFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                      <button onClick={() => openPicker('cabin2')} className="mt-2 p-2 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Choose from Library</button>
                    </div>
                )}
                {documentMode === 'proposal' && proposalCabinCount >= 3 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700" title="Cabin Image 3">轿厢图片 3</label>
                      <input type="file" name="cabinImage3" onChange={handleCabinEffectFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                      <button onClick={() => openPicker('cabin3')} className="mt-2 p-2 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Choose from Library</button>
                    </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="COP Image">操纵盘图片</label>
                  <input type="file" name="copImage" onChange={handleCabinEffectFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                  <button onClick={() => openPicker('cop')} className="mt-2 p-2 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Choose from Library</button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" title="LOP Image">外呼图片</label>
                  <input type="file" name="lopImage" onChange={handleCabinEffectFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                  <button onClick={() => openPicker('lop')} className="mt-2 p-2 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Choose from Library</button>
                </div>
                <HybridInput 
                  label="Landing Door"
                  labelChinese="厅门"
                  fieldName="landingDoor" 
                  fieldData={elevator.cabinEffect.landingDoor}
                  onTypeChange={handleHybridTypeChange}
                  onValueChange={handleHybridValueChange}
                  onFileChange={handleHybridFileChange}
                  onChooseFromLibrary={() => openPicker('landingDoor')} 
                />
                <HybridInput 
                  label="Ceiling" 
                  labelChinese="天花板" 
                  fieldName="ceiling" 
                  fieldData={elevator.cabinEffect.ceiling}
                  onChooseFromLibrary={() => openPicker('ceiling')}
                  onTypeChange={handleHybridTypeChange}
                  onValueChange={handleHybridValueChange}
                  onFileChange={handleHybridFileChange}
                />
                <HybridInput 
                  label="Button" 
                  labelChinese="按钮" 
                  fieldName="button" 
                  fieldData={elevator.cabinEffect.button}
                  onChooseFromLibrary={() => openPicker('button')}
                  onTypeChange={handleHybridTypeChange}
                  onValueChange={handleHybridValueChange}
                  onFileChange={handleHybridFileChange}
                />
                <HybridInput 
                  label="Floor" 
                  labelChinese="轿底" 
                  fieldName="floor" 
                  fieldData={elevator.cabinEffect.floor}
                  onTypeChange={handleHybridTypeChange}
                  onValueChange={handleHybridValueChange}
                  onFileChange={handleHybridFileChange}
                  onChooseFromLibrary={() => openPicker('floor')}
                />
                <HybridInput 
                  label="Handrail" 
                  labelChinese="扶手" 
                  fieldName="handrail" 
                  fieldData={elevator.cabinEffect.handrail}
                  onTypeChange={handleHybridTypeChange}
                  onValueChange={handleHybridValueChange}
                  onFileChange={handleHybridFileChange}
                  onChooseFromLibrary={() => openPicker('handrail')} 
                />
                <HybridInput 
                  label="COP LOGO" 
                  labelChinese="操纵盘 LOGO" 
                  fieldName="copLogo" 
                  fieldData={elevator.cabinEffect.copLogo}
                  onTypeChange={handleHybridTypeChange}
                  onValueChange={handleHybridValueChange}
                  onFileChange={handleHybridFileChange}
                  onChooseFromLibrary={() => openPicker('copLogo')} 
                />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ElevatorForm;
