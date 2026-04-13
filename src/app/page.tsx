
"use client";
import { useState, useMemo, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import ElevatorForm from '@/components/ElevatorForm';
import { elevatorTemplate } from '@/data/elevatorTemplate';

const Quote = () => {
  const [companyName, setCompanyName] = useState('Your Company Name');
  const [quotationNo, setQuotationNo] = useState('Q-2024001');
  const [projectName, setProjectName] = useState('Sample Project');
  const [quotationType, setQuotationType] = useState('FOB');
  const [quotationDate, setQuotationDate] = useState('');
  const [elevators, setElevators] = useState([{...elevatorTemplate, id: 1}]);
  const [freightDestination, setFreightDestination] = useState('e.g., Port of Shanghai');
  const [freightCost, setFreightCost] = useState(600);
  const [exchangeRate, setExchangeRate] = useState(1430);
  const [targetCurrency, setTargetCurrency] = useState('NGN');
  const [selectedElevatorId, setSelectedElevatorId] = useState<number | null>(null);
  const [focusedSection, setFocusedSection] = useState<string>('');

  const componentRef = useRef(null);
  const nextId = useRef(2);

  useEffect(() => {
    if (focusedSection) {
      const element = document.getElementById(`preview-${focusedSection}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [focusedSection]);

  useEffect(() => {
    if (elevators.length > 0) {
      setSelectedElevatorId(elevators[0].id);
    }
  }, []);

  const addElevator = () => {
    const newId = nextId.current;
    setElevators([...elevators, { ...elevatorTemplate, id: newId }]);
    nextId.current++;
  };

  const removeElevator = (id: number) => {
    setElevators(elevators.filter(elevator => elevator.id !== id));
  };

  const handleElevatorChange = (id: number, name: string, value: any) => {
    setElevators(elevators.map(elevator => 
      elevator.id === id ? { ...elevator, [name]: value } : elevator
    ));
  };

  const toggleElevatorCollapse = (id: number) => {
    setElevators(elevators.map(elevator =>
      elevator.id === id ? { ...elevator, isCollapsed: !elevator.isCollapsed } : elevator
    ));
  };

  useEffect(() => {
    setQuotationDate(new Date().toLocaleDateString('en-CA'));
  }, []);

  useEffect(() => {
    if (targetCurrency && targetCurrency !== 'USD' && targetCurrency !== '-') {
      fetch(`https://open.er-api.com/v6/latest/USD`)
        .then(response => response.json())
        .then(data => {
          if (data.rates && data.rates[targetCurrency]) {
            setExchangeRate(data.rates[targetCurrency]);
          }
        })
        .catch(error => console.error("Error fetching exchange rate:", error));
    } else {
      setExchangeRate(1);
    }
  }, [targetCurrency]);

  const grandTotal = useMemo(() => {
    const elevatorsTotal = elevators.reduce((total, elevator) => total + (elevator.unitPrice * elevator.qty), 0);
    return elevatorsTotal + freightCost;
  }, [elevators, freightCost]);

  const convertedTotal = useMemo(() => {
    return grandTotal * exchangeRate;
  }, [grandTotal, exchangeRate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* Left Side - Inputs */}
          <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-md no-print">
            <h2 className="text-xl font-semibold mb-4">Details<span className="block text-base font-normal text-gray-500">详细信息</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name<span className="block text-xs text-gray-500">公司名称</span></label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quotation No<span className="block text-xs text-gray-500">报价单号</span></label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={quotationNo}
                  onChange={(e) => setQuotationNo(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Project Name<span className="block text-xs text-gray-500">项目名称</span></label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quotation Type<span className="block text-xs text-gray-500">报价类型</span></label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={quotationType}
                  onChange={(e) => setQuotationType(e.target.value)}
                >
                  <option>EXW</option>
                  <option>FOB</option>
                  <option>CIF</option>
                </select>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mt-6 mb-4 border-t pt-4">Freight & Currency<span className="block text-sm font-normal text-gray-500">运费和货币</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Freight Destination<span className="block text-xs text-gray-500">目的地</span></label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={freightDestination}
                  onChange={(e) => setFreightDestination(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Freight Cost<span className="block text-xs text-gray-500">运费</span></label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={freightCost}
                  onChange={(e) => setFreightCost(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Currency<span className="block text-xs text-gray-500">目标货币</span></label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={targetCurrency}
                  onChange={(e) => setTargetCurrency(e.target.value)}
                >
                  <option value="-">-</option>
                  <option>NGN</option>
                  <option>CNY</option>
                  <option>USD</option>
                  <option>AUD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Exchange Rate<span className="block text-xs text-gray-500">汇率</span></label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                />
              </div>
            </div>

            {elevators.map((elevator, index) => (
              <ElevatorForm key={elevator.id} elevator={elevator} onChange={handleElevatorChange} onRemove={removeElevator} onToggleCollapse={toggleElevatorCollapse} onSectionFocus={setFocusedSection} />
            ))}
            <button onClick={addElevator} className="mt-4 w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600">Add Elevator</button>
          </div>

          {/* Right Side - Preview */}
          <div className="w-full md:w-1/2 sticky top-4 h-screen overflow-y-auto print-only-full-width">
            <button onClick={() => window.print()} className="mb-4 w-full p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 no-print">Generate PDF</button>
            <div ref={componentRef} className="w-full p-4 bg-white rounded-lg shadow-md">
              <Header />
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Quotation</h2>
                <div className="space-y-2">
                  <p><span className="font-semibold">Company:</span> {companyName}</p>
                  <p><span className="font-semibold">Quotation No:</span> {quotationNo}</p>
                  <p><span className="font-semibold">Project Name:</span> {projectName}</p>
                  <p><span className="font-semibold">Quotation Type:</span> {quotationType}</p>
                </div>

                <div className="mt-4 pt-4 border-t overflow-x-auto">
                  <h3 className="text-lg font-semibold mb-2">Price - Currency: USD</h3>
                  <table className="w-full text-sm text-left printable-table border-collapse">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-2 border border-gray-400">Description</th>
                        <th className="p-2 border border-gray-400">Specs</th>
                        <th className="p-2 border border-gray-400 text-center">QTY-sets</th>
                        <th className="p-2 border border-gray-400 text-right">Unit Price</th>
                        <th className="p-2 border border-gray-400 text-right">Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {elevators.map(elevator => (
                        <tr key={elevator.id}>
                          <td className="p-2 border border-gray-400 align-top">{elevator.description}</td>
                          <td className="p-2 border border-gray-400 align-top">
                            <div>{elevator.type}</div>
                            <div>{elevator.capacity}KG</div>
                            <div>{elevator.speed} M/S</div>
                            <div>{elevator.floorsStops}</div>
                          </td>
                          <td className="p-2 border border-gray-400 align-top text-center">{elevator.qty}</td>
                          <td className="p-2 border border-gray-400 align-top text-right">{elevator.unitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                          <td className="p-2 border border-gray-400 align-top text-right">{(elevator.unitPrice * elevator.qty).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={4} className="p-2 text-right font-semibold">Local fee and Freight from factory to {freightDestination} :</td>
                        <td className="p-2 text-right">{freightCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                      </tr>
                      <tr className="font-bold bg-gray-100">
                        <td colSpan={4} className="p-2 text-right">Total amount :</td>
                        <td className="p-2 text-right">{grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                      </tr>
                      {targetCurrency !== 'USD' && targetCurrency !== '-' && (
                        <tr className="font-bold">
                          <td colSpan={4} className="p-2 text-right">=</td>
                          <td className="p-2 text-right">{convertedTotal.toLocaleString('en-US', { style: 'currency', currency: targetCurrency })}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Specifications</h3>
                    <div className="flex space-x-1">
                      {elevators.map(e => (
                        <button 
                          key={e.id} 
                          onClick={() => setSelectedElevatorId(e.id)} 
                          className={`px-2 py-1 text-xs rounded-md ${selectedElevatorId === e.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                          Elevator #L{e.id}
                        </button>
                      ))}
                    </div>
                  </div>
                  {(() => {
                    const selectedElevator = elevators.find(e => e.id === selectedElevatorId);
                    if (!selectedElevator) return null;

                    const renderSpec = (label: string, value: any) => (
                      <div key={label} className="flex justify-between py-1 px-2 border-b last:border-b-0 hover:bg-gray-50">
                        <span className="text-sm text-gray-600">{label}</span>
                        <span className="text-sm font-medium text-right">{String(value)}</span>
                      </div>
                    );

                    return (
                      <div className="text-sm">
                        <div className="break-inside-avoid">
                          <h4 id="preview-basic-spec" className={`text-md font-semibold mt-2 border-b px-2 py-1 ${focusedSection === 'basic-spec' ? 'bg-yellow-200' : 'bg-gray-100'}`}>I. Basic specification</h4>
                          {renderSpec('Description', selectedElevator.description)}
                          {renderSpec('Type', selectedElevator.type)}
                          {renderSpec('Capacity (KG)', selectedElevator.capacity)}
                          {renderSpec('Speed (M/S)', selectedElevator.speed)}
                          {renderSpec('Floors/Stops', selectedElevator.floorsStops)}
                          {renderSpec('Control System', selectedElevator.controlSystem)}
                          {renderSpec('Drive System', selectedElevator.driveSystem)}
                        </div>
                        
                        <div className="break-inside-avoid">
                          <h4 id="preview-hoistway-spec" className={`text-md font-semibold mt-4 border-b px-2 py-1 ${focusedSection === 'hoistway-spec' ? 'bg-yellow-200' : 'bg-gray-100'}`}>II. Hoistway specification</h4>
                          {renderSpec('Headroom (mm)', selectedElevator.headroom)}
                          {renderSpec('Pit Depth (mm)', selectedElevator.pitDepth)}
                          {renderSpec('Shaft Size (W x D mm)', selectedElevator.shaftSize)}
                          {renderSpec('Machine Room Size (W x D x H mm)', selectedElevator.machineRoomSize)}
                        </div>

                        <div className="break-inside-avoid">
                          <h4 id="preview-car-spec" className={`text-md font-semibold mt-4 border-b px-2 py-1 ${focusedSection === 'car-spec' ? 'bg-yellow-200' : 'bg-gray-100'}`}>III. Car Specification</h4>
                          {renderSpec('COP Plate', selectedElevator.copPlate)}
                          {renderSpec('Car Net Dimension', selectedElevator.carNetDimension)}
                          {renderSpec('Car Ceiling', selectedElevator.carCeiling)}
                          {renderSpec('Car Floor', selectedElevator.carFloor)}
                          {renderSpec('Handrail', selectedElevator.carHandrail)}
                          {renderSpec('Left wall finish', selectedElevator.carWall.left)}
                          {renderSpec('Right wall finish', selectedElevator.carWall.right)}
                          {renderSpec('Rear wall finish', selectedElevator.carWall.rear)}
                        </div>

                        <div className="break-inside-avoid">
                          <h4 id="preview-door-spec" className={`text-md font-semibold mt-4 border-b px-2 py-1 ${focusedSection === 'door-spec' ? 'bg-yellow-200' : 'bg-gray-100'}`}>IV. Door specification</h4>
                          {renderSpec('Door Opening Type', selectedElevator.doorOpeningType)}
                          {renderSpec('Door Opening Size (W x H mm)', selectedElevator.doorOpeningSize)}
                          {renderSpec('Door Header Type', selectedElevator.doorHeaderType)}
                          {renderSpec('1st Floor Door Decoration', selectedElevator.firstFloorDoor)}
                          {renderSpec('Other Floors Door Decoration', selectedElevator.otherFloorsDoor)}
                        </div>

                        <div className="break-inside-avoid">
                          <h4 id="preview-function-spec" className={`text-md font-semibold mt-4 border-b px-2 py-1 ${focusedSection === 'function-spec' ? 'bg-yellow-200' : 'bg-gray-100'}`}>V. Function</h4>
                          {renderSpec('COP/LOP', selectedElevator.copLop)}
                          {selectedElevator.otherFunctions.map((func: any) => 
                            func.checked && renderSpec(func.name, 'Included')
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
                
                <div className="mt-4 pt-4 border-t text-right text-sm text-gray-500">
                  <p>Quotation Date: {quotationDate}</p>
                </div>
              </div>
              <div className="hidden print:block print-footer">
                www.xinfuji.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quote;
