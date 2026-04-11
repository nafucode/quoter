import { useState, useMemo, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Header from '@/components/Header';
import ElevatorForm from '@/components/ElevatorForm';
import { elevatorTemplate } from '@/data/elevatorTemplate';

const Quote = () => {
  const [companyName, setCompanyName] = useState('Your Company');
  const [quotationNo, setQuotationNo] = useState('Q-2024001');
  const [projectName, setProjectName] = useState('Sample Project');
  const [quotationType, setQuotationType] = useState('FOB');
  const [quotationDate, setQuotationDate] = useState('');

  const [elevators, setElevators] = useState([elevatorTemplate]);

  const [freightDestination, setFreightDestination] = useState('YIWU YY CARGO WAREHOUSE');
  const [freightCost, setFreightCost] = useState(600);
  const [exchangeRate, setExchangeRate] = useState(1430);
  const [targetCurrency, setTargetCurrency] = useState('NGN');

  const addElevator = () => {
    setElevators([...elevators, { ...elevatorTemplate, id: Date.now() }]);
  };

  const removeElevator = (id: number) => {
    setElevators(elevators.filter(elevator => elevator.id !== id));
  };

  const handleElevatorChange = (id: number, name: string, value: string | number) => {
    setElevators(elevators.map(elevator => 
      elevator.id === id ? { ...elevator, [name]: value } : elevator
    ));
  };

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

  const grandTotal = useMemo(() => {
    const elevatorsTotal = elevators.reduce((total, elevator) => total + (elevator.unitPrice * elevator.qty), 0);
    return elevatorsTotal + freightCost;
  }, [elevators, freightCost]);

  const convertedTotal = useMemo(() => {
    return grandTotal * exchangeRate;
  }, [grandTotal, exchangeRate]);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${companyName} - ${quotationNo}`,
    onAfterPrint: () => console.log('printed'),
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* Left Side - Inputs */}
          <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quotation No</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={quotationNo}
                  onChange={(e) => setQuotationNo(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quotation Type</label>
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
            
            {elevators.map((elevator, index) => (
              <ElevatorForm key={elevator.id} elevator={elevator} onChange={handleElevatorChange} onRemove={removeElevator} />
            ))}
            <button onClick={addElevator} className="mt-4 w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600">Add Elevator</button>

            <h3 className="text-lg font-semibold mt-6 mb-4 border-t pt-4">Freight & Currency</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Freight Destination</label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={freightDestination}
                  onChange={(e) => setFreightDestination(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Freight Cost</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={freightCost}
                  onChange={(e) => setFreightCost(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Currency</label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
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
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div>
            <button onClick={handlePrint} className="mb-4 w-full p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">Generate PDF</button>
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
                      {elevators.map(elevator => (
                        <tr key={elevator.id}>
                          <td className="p-2">{elevator.description}</td>
                          <td className="p-2">{elevator.type}</td>
                          <td className="p-2">{elevator.capacity}KG</td>
                          <td className="p-2">{elevator.speed} M/S</td>
                          <td className="p-2">{elevator.floorsStops}</td>
                          <td className="p-2">{elevator.qty}</td>
                          <td className="p-2 text-right">{elevator.unitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                          <td className="p-2 text-right">{(elevator.unitPrice * elevator.qty).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        </tr>
                      ))}
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
                  {/* Can be enhanced to show details for a selected elevator */}
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
