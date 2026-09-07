const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const context = vm.createContext({
    document: { getElementById: () => ({ addEventListener() {} }), addEventListener() {} },
    crypto: require('node:crypto').webcrypto,
    URLSearchParams,
});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../public/contract-maker/script.js'), 'utf8'), context);
const convert = vm.runInContext('(raw) => quotationContractRecord(normalizeQuotation(raw))', context);
const total = (record) => record.lineItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
const fixture = () => ({
    quotationNo: 'TEST-30000', companyName: 'Test Buyer',
    state: {
        quotationType: 'CIF', freightDestination: 'Manila Port', freightCost: 1200,
        targetCurrency: 'PHP', exchangeRate: 56.25, deliveryDays: 35,
        paymentTerm: '50% deposit\n50% before shipment',
        elevators: [
            { description: 'Passenger Lift (Glass Doors)', type: 'TKJW1000/1.0-VVVF', capacity: '1000', speed: '1.0', floorsStops: '5/5/5', machineRoom: 'MRL', qty: 2, unitPrice: 10000 },
            { description: 'Passenger Lift', type: 'TKJW800/1.0-VVVF', qty: 1, unitPrice: 8800 },
        ],
    },
});

test('imports all goods, freight and original USD prices with the saved exchange rate', () => {
    const record = convert(fixture());
    assert.equal(total(record), 30000);
    assert.equal(record.currency, 'USD');
    assert.equal(record.targetCurrency, 'PHP');
    assert.equal(record.exchangeRate, 56.25);
    assert.equal(record.tradeTerm, 'CIF Manila Port');
    assert.match(record.lineItems[0].description, /TKJW1000\/1.0-VVVF\n1000KG\n1.0m\/s\n5\/5\/5\nMRL/);
    assert.equal(record.paymentTerms, fixture().state.paymentTerm);
    assert.equal(record.shipmentDays, 35);
});

test('default EXW pickup ignores stale freight; custom EXW transport is charged', () => {
    const raw = fixture();
    raw.state.quotationType = 'EXW';
    raw.state.freightDestination = 'SHANGHAI PORT';
    assert.equal(total(convert(raw)), 28800);
    raw.state.freightDestination = 'To YY cargo Yiwu Warehouse China';
    raw.state.freightCost = 500;
    assert.equal(total(convert(raw)), 29300);
});

test('optional items and zero-priced equipment preserve quantity and price', () => {
    const raw = fixture();
    raw.state.shaftFrame = { enabled: true, text: 'Frame', qty: 2, price: 300 };
    raw.state.temperedGlass = { enabled: false, qty: 1, price: 9999 };
    assert.equal(total(convert(raw)), 30600);
    raw.state.elevators[0].unitPrice = 0;
    assert.equal(convert(raw).lineItems[0].price, 0);
});

test('imports available buyer details and tax ID without sample customer data', () => {
    const raw = fixture();
    raw.customerSnapshot = { companyName: 'Buyer Peru', address: 'Test address', phone: '123', email: 'buyer@example.test' };
    raw.state.country = 'Peru';
    raw.state.ruc = '20609067552';
    const record = convert(raw);
    assert.equal(record.buyerName, 'Buyer Peru');
    assert.equal(record.buyerCountry, 'Peru');
    assert.equal(record.buyerTaxId, '20609067552');
    assert.equal(record.buyerAddress, 'Test address');
    assert.equal(record.buyerTel, '123');
    assert.equal(record.buyerEmail, 'buyer@example.test');
    assert.equal(convert(fixture()).buyerAddress, '');
});

test('legacy item quotations retain their original currency and quantities', () => {
    const record = convert({ currency: 'EUR', items: [{ name: 'Lift', quantity: 3, unitPrice: 200 }] });
    assert.equal(record.currency, 'EUR');
    assert.equal(total(record), 600);
});
