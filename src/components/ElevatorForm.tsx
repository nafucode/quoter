import React from 'react';

interface ElevatorFormProps {
  elevator: any;
  onChange: (id: number, name: string, value: any) => void;
  onRemove: (id: number) => void;
  onToggleCollapse: (id: number) => void;
  onSectionFocus: (sectionId: string) => void;
}

const ElevatorForm: React.FC<ElevatorFormProps> = ({ elevator, onChange, onRemove, onToggleCollapse, onSectionFocus }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumber = e.target.type === 'number';
    onChange(elevator.id, name, isNumber ? Number(value) : value);
  };

  const handleFunctionChange = (funcId: number, field: string, value: string | boolean) => {
    const updatedFunctions = elevator.otherFunctions.map((func: any) => 
      func.id === funcId ? { ...func, [field]: value } : func
    );
    onChange(elevator.id, 'otherFunctions', updatedFunctions);
  };

  const addFunction = () => {
    const newFunction = { id: Date.now(), name: 'New Function', checked: false };
    const updatedFunctions = [...elevator.otherFunctions, newFunction];
    onChange(elevator.id, 'otherFunctions', updatedFunctions);
  };

  const removeFunction = (funcId: number) => {
    const updatedFunctions = elevator.otherFunctions.filter((func: any) => func.id !== funcId);
    onChange(elevator.id, 'otherFunctions', updatedFunctions);
  };

  return (
    <div className="p-4 mt-4 mb-4 border rounded-lg shadow-md bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Elevator #L{elevator.id}</h3>
        <div>
          <button onClick={() => onToggleCollapse(elevator.id)} className="px-3 py-1 text-sm text-white bg-gray-400 rounded-md hover:bg-gray-500 mr-2">
            {elevator.isCollapsed ? 'Expand' : 'Collapse'}
          </button>
          <button onClick={() => onRemove(elevator.id)} className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600">Remove</button>
        </div>
      </div>
      {!elevator.isCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input name="description" value={elevator.description} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input name="type" value={elevator.type} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity (kg)</label>
            <input type="number" name="capacity" value={elevator.capacity} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Speed (m/s)</label>
            <input type="number" step="0.01" name="speed" value={elevator.speed} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Qty</label>
            <input type="number" name="qty" value={elevator.qty} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          
          {/* Price Info */}
          <div className="sm:col-span-2">
            <div className="grid grid-cols-2 gap-4 p-4 mt-4 border rounded-lg bg-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                <input type="number" name="unitPrice" value={elevator.unitPrice} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Price</label>
                <p className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-200">
                  {(elevator.unitPrice * elevator.qty).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
              </div>
            </div>
          </div>

          {/* Basic Specification */}
          <div className="sm:col-span-2" onFocus={() => onSectionFocus('basic-spec')}>
            <h4 className="text-md font-semibold mt-4 border-b">I. Basic specification</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Control System</label>
                <input name="controlSystem" value={elevator.controlSystem} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Drive System</label>
                <input name="driveSystem" value={elevator.driveSystem} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Floors/Stops</label>
                <input name="floorsStops" value={elevator.floorsStops} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          </div>

          {/* Hoistway specification */}
          <div className="sm:col-span-2" onFocus={() => onSectionFocus('hoistway-spec')}>
            <h4 className="text-md font-semibold mt-4 border-b">II. Hoistway specification</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Headroom (mm)</label>
                <input type="number" name="headroom" value={elevator.headroom} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pit Depth (mm)</label>
                <input type="number" name="pitDepth" value={elevator.pitDepth} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Shaft Size (W x D mm)</label>
                <input name="shaftSize" value={elevator.shaftSize} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Machine Room Size (W x D x H mm)</label>
                <input name="machineRoomSize" value={elevator.machineRoomSize} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          </div>

          {/* Door specification */}
          <div className="sm:col-span-2" onFocus={() => onSectionFocus('door-spec')}>
            <h4 className="text-md font-semibold mt-4 border-b">III. Door specification</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Door Opening Type</label>
                <input name="doorOpeningType" value={elevator.doorOpeningType} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Door Opening Size (W x H mm)</label>
                <input name="doorOpeningSize" value={elevator.doorOpeningSize} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Door Header Type</label>
                <input name="doorHeaderType" value={elevator.doorHeaderType} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">1st Floor Door Decoration</label>
                <input name="firstFloorDoor" value={elevator.firstFloorDoor} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Other Floors Door Decoration</label>
                <input name="otherFloorsDoor" value={elevator.otherFloorsDoor} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          </div>

          {/* Cabin Decoration */}
          <div className="sm:col-span-2" onFocus={() => onSectionFocus('cabin-deco')}>
            <h4 className="text-md font-semibold mt-4 border-b">IV. Cabin Decoration</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Car Wall</label>
                <input name="carWall" value={elevator.carWall} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Car Ceiling</label>
                <input name="carCeiling" value={elevator.carCeiling} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Car Floor</label>
                <input name="carFloor" value={elevator.carFloor} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Car Handrail</label>
                <input name="carHandrail" value={elevator.carHandrail} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          </div>

          {/* Function */}
          <div className="sm:col-span-2" onFocus={() => onSectionFocus('function-spec')}>
            <h4 className="text-md font-semibold mt-4 border-b">V. Function</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">COP/LOP</label>
                <input name="copLop" value={elevator.copLop} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Other Functions</label>
                {elevator.otherFunctions.map((func: any) => (
                  <div key={func.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={func.checked}
                      onChange={(e) => handleFunctionChange(func.id, 'checked', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={func.name}
                      onChange={(e) => handleFunctionChange(func.id, 'name', e.target.value)}
                      className="flex-grow p-1 border border-gray-300 rounded-md shadow-sm"
                    />
                    <button onClick={() => removeFunction(func.id)} className="px-2 py-1 text-xs text-white bg-red-500 rounded-md hover:bg-red-600">Remove</button>
                  </div>
                ))}
                <button onClick={addFunction} className="mt-2 w-full p-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">+ Add Function</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElevatorForm;
