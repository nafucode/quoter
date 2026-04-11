import { useState, useMemo, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Header from '@/components/Header';

const Quote = () => {
  const [companyName, setCompanyName] = useState('Your Company');
  const [quotationNo, setQuotationNo] = useState('Q-2024001');
  const [projectName, setProjectName] = useState('Sample Project');

  // Price
  const [description, setDescription] = useState('Passenger Lift');
  const [unitPrice, setUnitPrice] = useState(8900);
  const [qty, setQty] = useState(1);
  const [freightDestination, setFreightDestination] = useState('YIWU YY CARGO WAREHOUSE');
  const [freightCost, setFreightCost] = useState(600);
  const [quotationType, setQuotationType] = useState('FOB');
  const [exchangeRate, setExchangeRate] = useState(1430);
  const [targetCurrency, setTargetCurrency] = useState('NGN');
  const [quotationDate, setQuotationDate] = useState('');

  // Basic Specification
  const [type, setType] = useState('TKJW 450/0.63-VF');
  const [capacity, setCapacity] = useState(450);
  const [speed, setSpeed] = useState(0.63);
  const [tractionMotorAndDrive, setTractionMotorAndDrive] = useState('Gearless motor, with VVVF control, Mona drive');
  const [carGroup, setCarGroup] = useState('Simplex Control');
  const [floorsStops, setFloorsStops] = useState('4/4');
  const [servingFloors, setServingFloors] = useState('G,1,2,3--COP & Display No.');
  const [carEntrances, setCarEntrances] = useState('Single entrance');
  const [powerVoltage, setPowerVoltage] = useState('380V-3 phase');
  const [lightingVoltage, setLightingVoltage] = useState('220V-1 phase');
  const [frequency, setFrequency] = useState('50HZ');
  const [machineRoomLocation, setMachineRoomLocation] = useState('Machine Room Less');
  const [autoRescueDevice, setAutoRescueDevice] = useState('Provided');
  const [ropingSystem, setRopingSystem] = useState('2:1');
  const [inverterAndControlBoard, setInverterAndControlBoard] = useState('Monarch NICE 3000');
  const [controllerBox, setControllerBox] = useState('Iron sheet-standard');

  // Shaft Specification
  const [shaftConstruction, setShaftConstruction] = useState('Concrete and brick');
  const [shaftWidth, setShaftWidth] = useState(1400);
  const [shaftDepth, setShaftDepth] = useState(2200);
  const [travel, setTravel] = useState(11000);
  const [pitDepth, setPitDepth] = useState(1000);
  const [overhead, setOverhead] = useState(3000);
  const [machineRoomHeight, setMachineRoomHeight] = useState('NONE');

  // Car Specification
  const [copPlate, setCopPlate] = useState('');
  const [carWidth, setCarWidth] = useState(1000);
  const [carDepth, setCarDepth] = useState(1400);
  const [carHeight, setCarHeight] = useState(2300);
  const [carCeiling, setCarCeiling] = useState('Mirror stainless steel frame, acrylic light decoration, LED light');
  const [carFloor, setCarFloor] = useState('PVC');
  const [handrail, setHandrail] = useState('1PCS Round type Stainless Steel');
  const [leftCarWall, setLeftCarWall] = useState('Hairline Stainless steel 1.2mm');
  const [rightCarWall, setRightCarWall] = useState('Hairline Stainless steel 1.2mm');
  const [rearCarWall, setRearCarWall] = useState('Hairline Stainless steel 1.2mm');

  useEffect(() => {
    setQuotationDate(new Date().toLocaleDateString('en-CA'));
  }, []);

  useEffect(() => {
    if (targetCurrency) {
      fetch(`https://open.er-api.com/v6/latest/USD`)
        .then(response => response.json())
        .then(data => {
          if (data.rates && data.rates[targetCurrency]) {
            setExchangeRate(data.rates[targetCurrency]);
          }
        })
        .catch(error => console.error("Error fetching exchange rate:", error));
    }
  }, [targetCurrency]);

  const itemTotal = useMemo(() => {
    return unitPrice * qty;
  }, [unitPrice, qty]);

  const grandTotal = useMemo(() => {
    return itemTotal + freightCost;
  }, [itemTotal, freightCost]);

  const convertedTotal = useMemo(() => {
    return grandTotal * exchangeRate;
  }, [grandTotal, exchangeRate]);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${companyName} - ${quotationNo}`,
    removeAfterPrint: true,
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* Left Side - Inputs */}
          <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quotation No</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={quotationNo}
                  onChange={(e) => setQuotationNo(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-4 border-t pt-4">Price</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Qty</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Freight Destination</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={freightDestination}
                  onChange={(e) => setFreightDestination(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Freight Cost</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={freightCost}
                  onChange={(e) => setFreightCost(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quotation Type</label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={quotationType}
                  onChange={(e) => setQuotationType(e.target.value)}
                >
                  <option>EXW</option>
                  <option>FOB</option>
                  <option>CIF</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Currency</label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={targetCurrency}
                  onChange={(e) => setTargetCurrency(e.target.value)}
                >
                  <option>NGN</option>
                  <option>CNY</option>
                  <option>USD</option>
                  <option>AUD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Exchange Rate</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-4 border-t pt-4">I. Basic specification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity (kg)</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Speed (m/s)</label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Traction motor & Drive</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={tractionMotorAndDrive}
                  onChange={(e) => setTractionMotorAndDrive(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Car Group</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={carGroup}
                  onChange={(e) => setCarGroup(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Floors/Stops</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={floorsStops}
                  onChange={(e) => setFloorsStops(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Serving floors</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={servingFloors}
                  onChange={(e) => setServingFloors(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Car Entrances</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={carEntrances}
                  onChange={(e) => setCarEntrances(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Power voltage</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={powerVoltage}
                  onChange={(e) => setPowerVoltage(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lighting voltage</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={lightingVoltage}
                  onChange={(e) => setLightingVoltage(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Frequency</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Machine room location</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={machineRoomLocation}
                  onChange={(e) => setMachineRoomLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Auto Rescue Device</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={autoRescueDevice}
                  onChange={(e) => setAutoRescueDevice(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Roping system</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={ropingSystem}
                  onChange={(e) => setRopingSystem(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Inverter & control board</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={inverterAndControlBoard}
                  onChange={(e) => setInverterAndControlBoard(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Controller box</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={controllerBox}
                  onChange={(e) => setControllerBox(e.target.value)}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-4 border-t pt-4">II. Shaft specification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Shaft construction</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={shaftConstruction}
                  onChange={(e) => setShaftConstruction(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Machine Room Height</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={machineRoomHeight}
                  onChange={(e) => setMachineRoomHeight(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Shaft Width (mm)</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={shaftWidth}
                  onChange={(e) => setShaftWidth(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Shaft Depth (mm)</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={shaftDepth}
                  onChange={(e) => setShaftDepth(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Travel (mm)</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={travel}
                  onChange={(e) => setTravel(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pit depth (mm)</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={pitDepth}
                  onChange={(e) => setPitDepth(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Overhead (mm)</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={overhead}
                  onChange={(e) => setOverhead(Number(e.target.value))}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-4 border-t pt-4">III. Car specification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">COP Plate</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={copPlate}
                  onChange={(e) => setCopPlate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Car Width (mm)</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={carWidth}
                  onChange={(e) => setCarWidth(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Car Depth (mm)</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={carDepth}
                  onChange={(e) => setCarDepth(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Car Height (mm)</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={carHeight}
                  onChange={(e) => setCarHeight(Number(e.target.value))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Car Ceiling</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={carCeiling}
                  onChange={(e) => setCarCeiling(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Car Floor</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={carFloor}
                  onChange={(e) => setCarFloor(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Handrail</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={handrail}
                  onChange={(e) => setHandrail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Left Car Wall</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={leftCarWall}
                  onChange={(e) => setLeftCarWall(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Right Car Wall</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={rightCarWall}
                  onChange={(e) => setRightCarWall(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rear Car Wall</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={rearCarWall}
                  onChange={(e) => setRearCarWall(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div>
            <button onClick={handlePrint} className="mb-4 w-full p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Generate PDF</button>
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

                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-2">Price - Currency: USD</h3>
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-2">Description</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Loading</th>
                        <th className="p-2">Speed</th>
                        <th className="p-2">F/S/D</th>
                        <th className="p-2">QTY</th>
                        <th className="p-2 text-right">Unit Price</th>
                        <th className="p-2 text-right">Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2">{description}</td>
                        <td className="p-2">{type}</td>
                        <td className="p-2">{capacity}KG</td>
                        <td className="p-2">{speed} M/S</td>
                        <td className="p-2">{floorsStops}</td>
                        <td className="p-2">{qty}</td>
                        <td className="p-2 text-right">{unitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        <td className="p-2 text-right">{itemTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                      </tr>
                      <tr>
                        <td colSpan={7} className="p-2 text-right font-semibold">Local fee and Freight from factory to {freightDestination} :</td>
                        <td className="p-2 text-right">{freightCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                      </tr>
                      <tr className="font-bold bg-gray-100">
                        <td colSpan={7} className="p-2 text-right">Total amount :</td>
                        <td className="p-2 text-right">{grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                      </tr>
                      <tr className="font-bold">
                        <td colSpan={7} className="p-2 text-right">=</td>
                        <td className="p-2 text-right">{convertedTotal.toLocaleString('en-US', { style: 'currency', currency: targetCurrency })}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-2">I. Basic specification</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <p><span className="font-semibold">Capacity:</span></p><p>{capacity} kg</p>
                    <p><span className="font-semibold">Speed:</span></p><p>{speed} m/s</p>
                    <p className="col-span-2"><span className="font-semibold">Traction motor & Drive:</span> {tractionMotorAndDrive}</p>
                    <p><span className="font-semibold">Car Group:</span></p><p>{carGroup}</p>
                    <p><span className="font-semibold">Floors/Stops:</span></p><p>{floorsStops}</p>
                    <p className="col-span-2"><span className="font-semibold">Serving floors:</span> {servingFloors}</p>
                    <p><span className="font-semibold">Car Entrances:</span></p><p>{carEntrances}</p>
                    <p><span className="font-semibold">Power voltage:</span></p><p>{powerVoltage}</p>
                    <p><span className="font-semibold">Lighting voltage:</span></p><p>{lightingVoltage}</p>
                    <p><span className="font-semibold">Frequency:</span></p><p>{frequency}</p>
                    <p><span className="font-semibold">Machine room location:</span></p><p>{machineRoomLocation}</p>
                    <p><span className="font-semibold">Auto Rescue Device:</span></p><p>{autoRescueDevice}</p>
                    <p><span className="font-semibold">Roping system:</span></p><p>{ropingSystem}</p>
                    <p className="col-span-2"><span className="font-semibold">Inverter & control board:</span> {inverterAndControlBoard}</p>
                    <p className="col-span-2"><span className="font-semibold">Controller box:</span> {controllerBox}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-2">II. Shaft specification</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <p><span className="font-semibold">Shaft construction:</span></p><p>{shaftConstruction}</p>
                    <p><span className="font-semibold">Machine Room Height:</span></p><p>{machineRoomHeight}</p>
                    <p><span className="font-semibold">Shaft Dimension:</span></p><p>{shaftWidth}mm W * {shaftDepth}mm D</p>
                    <p><span className="font-semibold">Travel:</span></p><p>{travel} mm</p>
                    <p><span className="font-semibold">Pit depth:</span></p><p>{pitDepth} mm</p>
                    <p><span className="font-semibold">Overhead:</span></p><p>{overhead} mm</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-2">III. Car specification</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <p><span className="font-semibold">COP Plate:</span></p><p>{copPlate}</p>
                    <p><span className="font-semibold">Car Net Dimension:</span></p><p>{carWidth}mm W * {carDepth}mm D * {carHeight}mm H</p>
                    <p className="col-span-2"><span className="font-semibold">Car Ceiling:</span> {carCeiling}</p>
                    <p><span className="font-semibold">Car Floor:</span></p><p>{carFloor}</p>
                    <p className="col-span-2"><span className="font-semibold">Handrail:</span> {handrail}</p>
                    <p><span className="font-semibold">Left Car Wall:</span></p><p>{leftCarWall}</p>
                    <p><span className="font-semibold">Right Car Wall:</span></p><p>{rightCarWall}</p>
                    <p><span className="font-semibold">Rear Car Wall:</span></p><p>{rearCarWall}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t text-right text-sm text-gray-500">
                  <p>Quotation Date: {quotationDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quote;
