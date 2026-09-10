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

test('CFR quotations preserve their destination and freight in contract import', () => {
    const raw = fixture();
    raw.state.quotationType = 'CFR';
    raw.state.freightDestination = 'Callao Port';
    const record = convert(raw);
    assert.equal(record.tradeTerm, 'CFR Callao Port');
    assert.equal(total(record), 30000);
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

test('contract bank presets match the six PI account choices', () => {
    const presets = vm.runInContext('bankPresets.map(({ id, bankName, accountNo, swiftCode }) => ({ id, bankName, accountNo, swiftCode }))', context);
    assert.deepEqual(JSON.parse(JSON.stringify(presets)), [
        { id: 'wema', bankName: 'Wema bank', accountNo: '7949338275', swiftCode: '' },
        { id: 'chouzhou', bankName: 'ZHEJIANG CHOUZHOU COMMERCIAL BANK CO.,LTD', accountNo: '13601002010090003861', swiftCode: 'CZCBCN2X' },
        { id: 'icbc', bankName: 'INDUSTRIAL & COMMERCIAL BANK OF CHINA (ICBC) Zhejiang Provincial Branch', accountNo: '1205240019200409295', swiftCode: 'ICBKCNBJZJP' },
        { id: 'jiangsu-rural', bankName: 'JIANGSU SUZHOU RURAL COMMERCIAL BANK CO., LTD', accountNo: '0706678981420100395359', swiftCode: 'WJRBCNBWXXX' },
        { id: 'boc-shenzhen-dongbu', bankName: 'BANK OF CHINA SHENZHEN DONGBU BRANCH', accountNo: '17870060775837651001', swiftCode: 'BKCHCNBJ45A' },
        { id: 'first-bank-ghana-gip', bankName: 'FIRST BANK OF NIGERIA, GHANA', accountNo: '9990000019924', swiftCode: 'INCEGHACXXX' },
    ]);
});

test('Word effect images are proportionally contained inside fixed bounds', () => {
    const resize = vm.runInContext('(width, height, maxWidth, maxHeight) => containedImageSize({ naturalWidth: width, naturalHeight: height }, maxWidth, maxHeight)', context);
    assert.deepEqual(JSON.parse(JSON.stringify(resize(274, 1252, 150, 320))), { width: 70, height: 320 });
    assert.deepEqual(JSON.parse(JSON.stringify(resize(1494, 1525, 150, 320))), { width: 150, height: 153 });
    assert.deepEqual(JSON.parse(JSON.stringify(resize(512, 512, 150, 76))), { width: 76, height: 76 });
});

test('contract language clause reflects the selected document languages', () => {
    const clauses = vm.runInContext('(languagePair) => buildClauses({ languagePair, tradeTerm: "FOB", shipmentDays: 45, paymentTerms: "TT", attachments: "Specification" })', context);
    const bilingual = clauses('zh-en');
    assert.match(bilingual, /executed in Chinese and English/);
    assert.doesNotMatch(bilingual, /executed in Russian, Chinese and English/);
    const trilingual = clauses('ru-zh-en');
    assert.match(trilingual, /executed in Russian, Chinese and English/);
    assert.match(trilingual, /составлен на русском, китайском и английском языках/);
});
