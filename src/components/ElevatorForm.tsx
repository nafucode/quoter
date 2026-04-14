import React from 'react';

const ElevatorForm = ({ elevator, onChange, onRemove, onToggleCollapse, onSectionFocus }: any) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange(elevator.id, name, value);
  };

  const handleFunctionChange = (funcId: number, key: string, value: any) => {
    const updatedFunctions = elevator.otherFunctions.map((func: any) => 
      func.id === funcId ? { ...func, [key]: value } : func
    );
    onChange(elevator.id, 'otherFunctions', updatedFunctions);
  };

  const handleCarWallChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const wall = name.split('.')[1]; // 'left', 'right', or 'rear'
    onChange(elevator.id, 'carWall', { ...elevator.carWall, [wall]: value });
  };

  const handleCabinEffectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newCabinEffect = { ...elevator.cabinEffect, [name]: value };
    onChange(elevator.id, 'cabinEffect', newCabinEffect);
  };

  const handleCabinEffectFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCabinEffect = { ...elevator.cabinEffect, [name]: reader.result as string };
        onChange(elevator.id, 'cabinEffect', newCabinEffect);
      };
      reader.readAsDataURL(file);
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
    onChange(elevator.id, 'cabinEffect', newCabinEffect);
  };

  const handleHybridFileChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleCabinEffectHybridChange(fieldName, 'value', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addFunction = () => {
    const newFunction = { id: Date.now(), name: 'New Function', checked: false };
    const updatedFunctions = [...elevator.otherFunctions, newFunction];
    onChange(elevator.id, 'otherFunctions', updatedFunctions);
  };

  const HybridInput = ({ label, labelChinese, fieldName }: { label: string, labelChinese: string, fieldName: string }) => {
    const fieldData = elevator.cabinEffect[fieldName];
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}<span className="block text-xs text-gray-500">{labelChinese}</span></label>
        <div className="flex items-center gap-2 mt-1">
          <label className="text-sm">
            <input type="radio" name={`${fieldName}-type`} value="text" checked={fieldData.type === 'text'} onChange={() => handleCabinEffectHybridChange(fieldName, 'type', 'text')} className="mr-1"/>
            Text
          </label>
          <label className="text-sm">
            <input type="radio" name={`${fieldName}-type`} value="image" checked={fieldData.type === 'image'} onChange={() => handleCabinEffectHybridChange(fieldName, 'type', 'image')} className="mr-1"/>
            Image
          </label>
        </div>
        {fieldData.type === 'text' ? (
          <input type="text" value={fieldData.value} onChange={(e) => handleCabinEffectHybridChange(fieldName, 'value', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        ) : (
          <input type="file" onChange={(e) => handleHybridFileChange(fieldName, e)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
        )}
      </div>
    );
  };

  return (
    <div className="border-t mt-4 pt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Elevator #L{elevator.id}</h3>
        <div>
          <button onClick={() => onToggleCollapse(elevator.id)} className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 mr-2">
            {elevator.isCollapsed ? 'Expand' : 'Collapse'}
          </button>
          <button onClick={() => onRemove(elevator.id)} className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600">Remove</button>
        </div>
      </div>
      {!elevator.isCollapsed && (
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Basic Info */}
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4" onFocus={() => onSectionFocus('basic-spec')}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description<span className="block text-xs text-gray-500">描述</span></label>
                <input name="description" value={elevator.description} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type<span className="block text-xs text-gray-500">类型</span></label>
                <input name="type" value={elevator.type} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity (kg)<span className="block text-xs text-gray-500">载重 (kg)</span></label>
                <input name="capacity" value={elevator.capacity} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Speed (m/s)<span className="block text-xs text-gray-500">速度 (m/s)</span></label>
                <input name="speed" value={elevator.speed} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Qty<span className="block text-xs text-gray-500">数量</span></label>
                <input name="qty" value={elevator.qty} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Price<span className="block text-xs text-gray-500">单价</span></label>
                <input name="unitPrice" value={elevator.unitPrice} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>

            {/* Specifications */}
            <div className="sm:col-span-2" onFocus={() => onSectionFocus('basic-spec')}>
              <h4 className="text-md font-semibold mt-4 border-b">I. Basic specification<span className="block text-sm font-normal text-gray-500">基本规格</span></h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Floors/Stops<span className="block text-xs text-gray-500">楼层/站</span></label>
                  <input name="floorsStops" value={elevator.floorsStops} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Control System<span className="block text-xs text-gray-500">控制系统</span></label>
                  <input name="controlSystem" value={elevator.controlSystem} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Drive System<span className="block text-xs text-gray-500">驱动系统</span></label>
                  <input name="driveSystem" value={elevator.driveSystem} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2" onFocus={() => onSectionFocus('hoistway-spec')}>
              <h4 className="text-md font-semibold mt-4 border-b">II. Hoistway specification<span className="block text-sm font-normal text-gray-500">井道规格</span></h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Headroom (mm)<span className="block text-xs text-gray-500">顶层高度 (mm)</span></label>
                  <input name="headroom" value={elevator.headroom} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pit Depth (mm)<span className="block text-xs text-gray-500">底坑深度 (mm)</span></label>
                  <input name="pitDepth" value={elevator.pitDepth} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Shaft Size (W x D mm)<span className="block text-xs text-gray-500">井道尺寸 (宽 x 深 mm)</span></label>
                  <input name="shaftSize" value={elevator.shaftSize} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Machine Room Size (W x D x H mm)<span className="block text-xs text-gray-500">机房尺寸 (宽 x 深 x 高 mm)</span></label>
                  <input name="machineRoomSize" value={elevator.machineRoomSize} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2" onFocus={() => onSectionFocus('car-spec')}>
              <h4 className="text-md font-semibold mt-4 border-b">III. Car Specification<span className="block text-sm font-normal text-gray-500">轿厢规格</span></h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">COP Plate<span className="block text-xs text-gray-500">操纵盘</span></label>
                  <input name="copPlate" value={elevator.copPlate} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Car Net Dimension<span className="block text-xs text-gray-500">轿厢净尺寸</span></label>
                  <input name="carNetDimension" value={elevator.carNetDimension} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Car Ceiling<span className="block text-xs text-gray-500">轿顶</span></label>
                  <input name="carCeiling" value={elevator.carCeiling} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Car Floor<span className="block text-xs text-gray-500">轿底</span></label>
                  <input name="carFloor" value={elevator.carFloor} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Handrail<span className="block text-xs text-gray-500">扶手</span></label>
                  <input name="carHandrail" value={elevator.carHandrail} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Car wall finish<span className="block text-xs text-gray-500">轿壁装饰</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Left wall<span className="block text-xs text-gray-500">左壁</span></label>
                      <input name="carWall.left" value={elevator.carWall.left} onChange={handleCarWallChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Right wall<span className="block text-xs text-gray-500">右壁</span></label>
                      <input name="carWall.right" value={elevator.carWall.right} onChange={handleCarWallChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Rear wall<span className="block text-xs text-gray-500">后壁</span></label>
                      <input name="carWall.rear" value={elevator.carWall.rear} onChange={handleCarWallChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2" onFocus={() => onSectionFocus('door-spec')}>
              <h4 className="text-md font-semibold mt-4 border-b">IV. Door specification<span className="block text-sm font-normal text-gray-500">门规格</span></h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Door Opening Type<span className="block text-xs text-gray-500">开门方式</span></label>
                  <input name="doorOpeningType" value={elevator.doorOpeningType} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Door Opening Size (W x H mm)<span className="block text-xs text-gray-500">开门尺寸 (宽 x 高 mm)</span></label>
                  <input name="doorOpeningSize" value={elevator.doorOpeningSize} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Door Header Type<span className="block text-xs text-gray-500">门头类型</span></label>
                  <input name="doorHeaderType" value={elevator.doorHeaderType} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">1st Floor Door Decoration<span className="block text-xs text-gray-500">首层门装饰</span></label>
                  <input name="firstFloorDoor" value={elevator.firstFloorDoor} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Other Floors Door Decoration<span className="block text-xs text-gray-500">其它楼层门装饰</span></label>
                  <input name="otherFloorsDoor" value={elevator.otherFloorsDoor} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2" onFocus={() => onSectionFocus('function-spec')}>
              <h4 className="text-md font-semibold mt-4 border-b">V. Function<span className="block text-sm font-normal text-gray-500">功能</span></h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">COP/LOP<span className="block text-xs text-gray-500">操纵盘/外呼</span></label>
                  <input name="copLop" value={elevator.copLop} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Other Functions<span className="block text-xs text-gray-500">其它功能</span></label>
                  {elevator.otherFunctions.map((func: any) => (
                    <div key={func.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={func.checked} onChange={(e) => handleFunctionChange(func.id, 'checked', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                      <input type="text" value={func.name} onChange={(e) => handleFunctionChange(func.id, 'name', e.target.value)} className="block w-full p-1 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                  ))}
                  <button onClick={addFunction} className="mt-2 p-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Function</button>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2" onFocus={() => onSectionFocus('cabin-effect')}>
              <h4 className="text-md font-semibold mt-4 border-b">VI. Cabin Effect<span className="block text-sm font-normal text-gray-500">效果图</span></h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cabin Image<span className="block text-xs text-gray-500">轿厢图片</span></label>
                  <input type="file" name="cabinImage" onChange={handleCabinEffectFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">COP Image<span className="block text-xs text-gray-500">操纵盘图片</span></label>
                  <input type="file" name="copImage" onChange={handleCabinEffectFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                  <button onClick={() => onChange(elevator.id, 'cabinEffect', { ...elevator.cabinEffect, copImage: '/Standard-COPLOP.png' })} className="mt-2 p-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600">Use Standard</button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">LOP Image<span className="block text-xs text-gray-500">外呼图片</span></label>
                  <input type="file" name="lopImage" onChange={handleCabinEffectFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                  <button onClick={() => onChange(elevator.id, 'cabinEffect', { ...elevator.cabinEffect, lopImage: '/Standard-COPLOP.png' })} className="mt-2 p-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600">Use Standard</button>
                </div>
                <HybridInput label="Landing Door" labelChinese="厅门" fieldName="landingDoor" />
                <HybridInput label="Ceiling" labelChinese="天花板" fieldName="ceiling" />
                <HybridInput label="Button" labelChinese="按钮" fieldName="button" />
                <HybridInput label="Floor" labelChinese="轿底" fieldName="floor" />
                <HybridInput label="Handrail" labelChinese="扶手" fieldName="handrail" />
                <HybridInput label="COP LOGO" labelChinese="操纵盘 LOGO" fieldName="copLogo" />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ElevatorForm;
