const form = document.getElementById('contract-form');
const lineItemsContainer = document.getElementById('line-items');
const addLineButton = document.getElementById('add-line-button');
const resetButton = document.getElementById('reset-button');
const saveRecordButton = document.getElementById('save-record-button');
const pdfButton = document.getElementById('pdf-button');
const printPreviewButton = document.getElementById('print-preview-button');
const recordsList = document.getElementById('records-list');
const recordsCount = document.getElementById('records-count');
const refreshQuotesButton = document.getElementById('refresh-quotes-button');
const quoteSelect = document.getElementById('quote-select');
const includeSpecificationInput = document.getElementById('include-specification');
const quoteHelper = document.getElementById('quote-helper');

const RECORDS_KEY = 'xinfuji_contract_records';
const QUOTATION_KEY = 'nafu_trade_quotations';
const QUOTER_HISTORY_KEY = 'quoter_history';
let quotationHistory = [];

const currencySettings = {
    USD: { symbol: 'USD', english: 'US DOLLARS', local: '美元' },
    CNY: { symbol: 'CNY', english: 'CHINESE YUAN', local: '人民币' },
    EUR: { symbol: 'EUR', english: 'EUROS', local: '欧元' }
};

const defaultLines = [
    { artNo: 'L1', description: '无机房电梯  MRL Elevator 630KG, 1.0m/s, 7/7/7, CO-2P', unit: '台 Unit', quantity: 1, price: 10600 },
    { artNo: 'L2', description: '无机房电梯  MRL Elevator 1000KG, 1.0m/s, 7/7/7, CO-2P', unit: '台 Unit', quantity: 1, price: 10800 }
];

const partyNotice = {
    'zh-en': 'The above information is the specified and contractually effective contractual subjects and their contact details in the signed contract between the sellers and the buyers. Any modification shall be notified to the other party in writing and confirmed in writing before it becomes effective.',
    'ru-zh-en': 'Указанные выше данные продавца и покупателя являются действительными реквизитами сторон по настоящему договору. Любые изменения должны быть направлены другой стороне в письменной форме и подтверждены письменно.\n上述信息系买卖双方在合同订立时指定的具有合同效力的主体信息及联系方式，如需变更，应以书面方式通知对方并经对方书面确认。\nThe above seller and buyer information is contractually effective. Any modification shall be notified to the other party in writing and confirmed in writing before it becomes effective.'
};

function todayValue() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function defaultContractNumber(dateValue = todayValue()) {
    const [year, month, day] = dateValue.split('-');
    return `XFJH${year.slice(-2)}${month}${day}01`;
}

function textValue(id) {
    return document.getElementById(id).value.trim();
}

function numberValue(id) {
    return Number.parseFloat(document.getElementById(id).value) || 0;
}

function setText(id, value) {
    document.getElementById(id).textContent = value;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function readJsonStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function formatDate(dateValue) {
    if (!dateValue) return todayValue();
    return dateValue.replaceAll('-', '.');
}

function formatLocalDate(dateValue) {
    const value = dateValue || todayValue();
    const [year, month, day] = value.split('-');
    return `${year}年${Number(month)}月${Number(day)}日`;
}

function formatRussianDate(dateValue) {
    const value = dateValue || todayValue();
    const [year, month, day] = value.split('-');
    return `${day}.${month}.${year}`;
}

function isRussianContract(languagePair) {
    return languagePair === 'ru-zh-en' || languagePair === 'ru-en';
}

function formatMoney(value) {
    const currency = document.getElementById('currency').value;
    const settings = currencySettings[currency] || currencySettings.USD;
    return `${settings.symbol}${Number(value || 0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function numberToEnglishWords(value) {
    const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
    const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

    function underThousand(num) {
        const parts = [];
        if (num >= 100) {
            parts.push(`${ones[Math.floor(num / 100)]} HUNDRED`);
            num %= 100;
        }
        if (num >= 20) {
            parts.push(tens[Math.floor(num / 10)]);
            num %= 10;
        }
        if (num > 0) {
            parts.push(ones[num]);
        }
        return parts.join(' ');
    }

    const integer = Math.floor(Math.abs(value));
    if (integer === 0) return 'ZERO';

    const groups = [
        { value: 1000000000, label: 'BILLION' },
        { value: 1000000, label: 'MILLION' },
        { value: 1000, label: 'THOUSAND' },
        { value: 1, label: '' }
    ];
    let remaining = integer;
    const words = [];

    groups.forEach((group) => {
        const count = Math.floor(remaining / group.value);
        if (count) {
            words.push(`${underThousand(count)} ${group.label}`.trim());
            remaining %= group.value;
        }
    });

    return words.join(' ');
}

function approximateChineseAmount(value) {
    const currency = document.getElementById('currency').value;
    const settings = currencySettings[currency] || currencySettings.USD;
    return `${settings.symbol} ${Number(value || 0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })} ${settings.local}`;
}

function renderGoodsHead(russianContract) {
    const headers = russianContract
        ? [
            ['Артикул', '货号', 'Art No.'],
            ['Описание', '名称及规格', 'Descriptions'],
            ['Ед.', '单位', 'Unit'],
            ['Кол-во', '数量', 'Quantity'],
            ['Цена', '单价', 'Unit Price'],
            ['Сумма', '金额', 'Amount']
        ]
        : [
            ['Art No.', '货号'],
            ['Descriptions', '名称及规格'],
            ['Unit', '单位'],
            ['Quantity', '数量'],
            ['Unit Price', '单价'],
            ['Amount', '金额']
        ];

    document.getElementById('preview-goods-head').innerHTML = `
        <tr>
            ${headers.map((parts) => {
                const [primary, ...secondary] = parts;
                return `<th>${escapeHtml(primary)}${secondary.map((part) => `<br><span>${escapeHtml(part)}</span>`).join('')}</th>`;
            }).join('')}
        </tr>
    `;
}

function compactValue(value) {
    if (value === undefined || value === null || value === '') return '';
    if (typeof value === 'object') {
        return value.name || value.label || value.model || value.text || value.value || '';
    }
    return String(value);
}

function specRow(parameter, value) {
    const cleanValue = compactValue(value);
    return cleanValue ? { parameter, value: cleanValue } : null;
}

function normalizeElevatorItem(elevator = {}, index = 0) {
    const quantity = Number(elevator.qty || elevator.quantity || 1);
    const unitPrice = Number(elevator.unitPrice || elevator.price || 0);
    const capacity = compactValue(elevator.capacity || elevator.load);
    const speed = compactValue(elevator.speed);
    const floorsStops = compactValue(elevator.floorsStops || elevator.floors || elevator.stops);
    const nameParts = [compactValue(elevator.type || elevator.elevatorType || elevator.name || elevator.description || 'Elevator'), capacity, speed].filter(Boolean);
    const description = [
        compactValue(elevator.description),
        capacity ? `Capacity: ${capacity}` : '',
        speed ? `Speed: ${speed}` : '',
        floorsStops ? `Floors/Stops: ${floorsStops}` : ''
    ].filter(Boolean).join('; ');

    const cabinEffect = elevator.cabinEffect || {};
    const specs = [
        specRow('Elevator Type', elevator.type || elevator.elevatorType || elevator.description),
        specRow('Capacity', capacity),
        specRow('Speed', speed),
        specRow('Floors / Stops', floorsStops),
        specRow('Quantity', quantity),
        specRow('Machine Room', elevator.machineRoom || elevator.machineRoomType),
        specRow('Door Opening', elevator.doorOpening || elevator.doorWidth),
        specRow('Door Type', elevator.doorType),
        specRow('Control System', elevator.controlSystem),
        specRow('Drive System', elevator.driveSystem),
        specRow('Cabin', cabinEffect.cabin || elevator.cabin),
        specRow('Ceiling', cabinEffect.ceiling || elevator.ceiling),
        specRow('Floor', cabinEffect.floor || elevator.floor),
        specRow('COP', cabinEffect.button || elevator.cop),
        specRow('LOP', cabinEffect.lop || elevator.lop),
        specRow('Landing Door', cabinEffect.landingDoor || elevator.landingDoor),
        specRow('Handrail', cabinEffect.handrail || elevator.handrail),
        specRow('Certification', elevator.certificationStandard || elevator.certification)
    ].filter(Boolean);

    return {
        id: elevator.id || `elevator-${index + 1}`,
        name: nameParts.join(' ') || `Elevator ${index + 1}`,
        description: description || compactValue(elevator.description) || 'Elevator specification from saved quotation.',
        imageDataUrl: elevator.imageDataUrl || '',
        cabinStyleImagePath: compactValue(cabinEffect.cabinImagePath || elevator.cabinStyleImagePath || elevator.imagePath),
        quantity,
        unitPrice,
        totalPrice: Number(elevator.totalPrice || quantity * unitPrice || 0),
        advantages: Array.isArray(elevator.advantages) ? elevator.advantages.filter(Boolean) : [],
        specifications: specs
    };
}

function normalizeQuoteItem(item = {}) {
    const quantity = Number(item.quantity || 0);
    const unitPrice = Number(item.unitPrice || item.price || item.costPrice || 0);
    return {
        id: item.id || crypto.randomUUID(),
        name: item.name || item.productName || 'Product',
        description: item.description || '',
        imageDataUrl: item.imageDataUrl || '',
        cabinStyleImagePath: item.cabinStyleImagePath || '',
        quantity,
        unitPrice,
        totalPrice: Number(item.totalPrice || quantity * unitPrice || 0),
        advantages: Array.isArray(item.advantages) ? item.advantages.filter(Boolean) : [],
        specifications: Array.isArray(item.specifications)
            ? item.specifications.map((spec) => {
                if (typeof spec === 'string') return { parameter: spec, value: '' };
                return {
                    parameter: spec?.parameter || spec?.label || '',
                    value: spec?.value || ''
                };
            }).filter((spec) => spec.parameter || spec.value)
            : []
    };
}

function normalizeQuotation(quote = {}, index = 0) {
    const stateElevators = Array.isArray(quote.state?.elevators) ? quote.state.elevators : [];
    const items = Array.isArray(quote.items) && quote.items.length
        ? quote.items.map(normalizeQuoteItem)
        : stateElevators.map(normalizeElevatorItem);
    const totalAmount = Number(quote.totalAmount || quote.grandTotal || items.reduce((sum, item) => sum + item.totalPrice, 0));
    const customer = quote.customerSnapshot || {};
    return {
        id: String(quote.id || quote.quotationNo || `quote-${index}`),
        quotationNo: quote.quotationNo || quote.quoteNo || `Quotation ${index + 1}`,
        issueDate: quote.issueDate || quote.quotationDate || quote.savedAt || quote.createdAt || '',
        customerName: customer.companyName || quote.companyName || quote.customerName || '',
        projectName: quote.projectName || quote.state?.projectName || '',
        currency: quote.currency || quote.targetCurrency || quote.state?.targetCurrency || 'USD',
        totalAmount,
        items,
        raw: quote
    };
}

function dedupeQuotations(quotes) {
    const seen = new Set();
    return quotes.filter((quote) => {
        const key = quote.id || quote.quotationNo;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function loadQuotationHistory() {
    const quoterHistory = readJsonStorage(QUOTER_HISTORY_KEY, []);
    const legacyHistory = readJsonStorage(QUOTATION_KEY, []);
    quotationHistory = dedupeQuotations([...quoterHistory, ...legacyHistory].map(normalizeQuotation));
    renderQuoteSelect();
}

function renderQuoteSelect(selectedId = quoteSelect.value) {
    if (!quotationHistory.length) {
        quoteSelect.innerHTML = '<option value="">No saved quotations found / 未找到历史报价</option>';
        quoteSelect.disabled = true;
        includeSpecificationInput.checked = false;
        quoteHelper.textContent = '未读取到报价器历史。请先在报价器首页点击「保存到报价库」，然后回到这里点击刷新。';
        return;
    }

    quoteSelect.disabled = false;
    quoteSelect.innerHTML = [
        '<option value="">No attachment / 不附加规格</option>',
        ...quotationHistory.map((quote) => {
            const meta = [quote.customerName, quote.projectName, quote.issueDate].filter(Boolean).join(' · ');
            const amount = quote.totalAmount ? ` · ${quote.currency} ${Math.round(quote.totalAmount).toLocaleString('en-US')}` : '';
            return `<option value="${escapeHtml(quote.id)}">${escapeHtml(quote.quotationNo)}${meta ? ` - ${escapeHtml(meta)}` : ''}${escapeHtml(amount)}</option>`;
        })
    ].join('');

    if (selectedId && quotationHistory.some((quote) => quote.id === selectedId)) {
        quoteSelect.value = selectedId;
    } else {
        quoteSelect.value = quotationHistory[0]?.id || '';
    }
    includeSpecificationInput.checked = Boolean(quoteSelect.value);
    quoteHelper.textContent = `已同步 ${quotationHistory.length} 份报价器历史。Specification 附件会跳过报价第一页，只保留产品规格页。`;
}

function selectedQuotation() {
    if (!includeSpecificationInput.checked || !quoteSelect.value) return null;
    return quotationHistory.find((quote) => quote.id === quoteSelect.value) || null;
}

function imageSourceForItem(item) {
    const source = item.imageDataUrl || item.cabinStyleImagePath || '';
    if (!source) return '';
    if (source.startsWith('data:') || source.startsWith('http://') || source.startsWith('https://')) return source;
    return source;
}

function createLineItem(line = { artNo: '', description: '', unit: '台 Unit', quantity: 1, price: 0 }) {
    const row = document.createElement('div');
    row.className = 'line-item';
    row.innerHTML = `
        <label class="field art-field">
            <span>Art No. / 货号</span>
            <input class="line-art-input" type="text" value="${escapeHtml(line.artNo)}">
        </label>
        <label class="field line-description">
            <span>Description / 名称及规格</span>
            <input class="line-description-input" type="text" value="${escapeHtml(line.description)}">
        </label>
        <label class="field">
            <span>Unit / 单位</span>
            <input class="line-unit-input" type="text" value="${escapeHtml(line.unit)}">
        </label>
        <label class="field qty-field">
            <span>Qty / 数量</span>
            <input class="line-quantity-input" type="number" min="0" step="1" value="${line.quantity}">
        </label>
        <label class="field price-field">
            <span>Unit Price / 单价</span>
            <input class="line-price-input" type="number" min="0" step="0.01" value="${line.price}">
        </label>
        <button class="icon-button remove-line-button" type="button" aria-label="Remove item / 删除项目">×</button>
    `;

    row.querySelector('.remove-line-button').addEventListener('click', () => {
        row.remove();
        if (!lineItemsContainer.children.length) createLineItem();
        updatePreview();
    });

    lineItemsContainer.appendChild(row);
}

function replaceLineItems(lines) {
    lineItemsContainer.innerHTML = '';
    (lines && lines.length ? lines : defaultLines).forEach(createLineItem);
}

function getLineItems() {
    return [...lineItemsContainer.querySelectorAll('.line-item')].map((row) => {
        const quantity = Number.parseFloat(row.querySelector('.line-quantity-input').value) || 0;
        const price = Number.parseFloat(row.querySelector('.line-price-input').value) || 0;
        return {
            artNo: row.querySelector('.line-art-input').value.trim() || 'L',
            description: row.querySelector('.line-description-input').value.trim() || 'Elevator',
            unit: row.querySelector('.line-unit-input').value.trim() || 'Unit',
            quantity,
            price,
            amount: quantity * price
        };
    });
}

function collectFormData() {
    return {
        contractNumber: textValue('contract-number') || defaultContractNumber(textValue('contract-date') || todayValue()),
        contractDate: textValue('contract-date') || todayValue(),
        signedAt: textValue('signed-at'),
        languagePair: document.getElementById('language-pair').value,
        tradeTerm: textValue('trade-term'),
        currency: document.getElementById('currency').value,
        buyerName: textValue('buyer-name'),
        buyerAddress: textValue('buyer-address'),
        buyerTel: textValue('buyer-tel'),
        buyerEmail: textValue('buyer-email'),
        shipmentDays: numberValue('shipment-days'),
        paymentTerms: textValue('payment-terms'),
        priceNote: textValue('price-note'),
        attachments: textValue('attachments'),
        beneficiaryBank: textValue('beneficiary-bank'),
        bankAddress: textValue('bank-address'),
        accountNumber: textValue('account-number'),
        swiftCode: textValue('swift-code'),
        intermediaryBank: textValue('intermediary-bank'),
        intermediarySwift: textValue('intermediary-swift'),
        includeSpecification: includeSpecificationInput.checked,
        selectedQuotationId: quoteSelect.value,
        lineItems: getLineItems(),
        updatedAt: new Date().toISOString()
    };
}

function applyRecord(record) {
    document.getElementById('contract-number').value = record.contractNumber || defaultContractNumber();
    document.getElementById('contract-date').value = record.contractDate || todayValue();
    document.getElementById('signed-at').value = record.signedAt || 'SUZHOU, CHINA';
    document.getElementById('language-pair').value = isRussianContract(record.languagePair) ? 'ru-zh-en' : 'zh-en';
    document.getElementById('trade-term').value = record.tradeTerm || 'FOB Shanghai';
    document.getElementById('currency').value = record.currency || 'USD';
    document.getElementById('buyer-name').value = record.buyerName || '';
    document.getElementById('buyer-address').value = record.buyerAddress || '';
    document.getElementById('buyer-tel').value = record.buyerTel || '';
    document.getElementById('buyer-email').value = record.buyerEmail || '';
    document.getElementById('shipment-days').value = record.shipmentDays || 45;
    document.getElementById('payment-terms').value = record.paymentTerms || '';
    document.getElementById('price-note').value = record.priceNote || '';
    document.getElementById('attachments').value = record.attachments || '';
    document.getElementById('beneficiary-bank').value = record.beneficiaryBank || '';
    document.getElementById('bank-address').value = record.bankAddress || '';
    document.getElementById('account-number').value = record.accountNumber || '';
    document.getElementById('swift-code').value = record.swiftCode || '';
    document.getElementById('intermediary-bank').value = record.intermediaryBank || '';
    document.getElementById('intermediary-swift').value = record.intermediarySwift || '';
    renderQuoteSelect(record.selectedQuotationId || '');
    includeSpecificationInput.checked = record.includeSpecification !== false && Boolean(quoteSelect.value);
    replaceLineItems(record.lineItems);
    updatePreview();
}

function readRecords() {
    try {
        return JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]');
    } catch {
        return [];
    }
}

function writeRecords(records) {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

function renderRecords() {
    const records = readRecords();
    recordsCount.textContent = `${records.length} ${records.length === 1 ? 'record' : 'records'}`;

    if (!records.length) {
        recordsList.innerHTML = '<p class="empty-records">No saved records yet. / 暂无保存记录</p>';
        return;
    }

    recordsList.innerHTML = records.map((record) => {
        const total = (record.lineItems || []).reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0), 0);
        const savedDate = new Date(record.updatedAt || Date.now()).toLocaleString('zh-CN');
        return `
            <article class="record-row" data-record-id="${escapeHtml(record.contractNumber)}">
                <div>
                    <strong>${escapeHtml(record.contractNumber)}</strong>
                    <p>${escapeHtml(record.buyerName || 'Buyer Not Provided')}</p>
                </div>
                <div>
                    <span>Total</span>
                    <strong>${escapeHtml(record.currency || 'USD')} ${Number(total || 0).toLocaleString('en-US')}</strong>
                </div>
                <div>
                    <span>Trade Term</span>
                    <strong>${escapeHtml(record.tradeTerm || 'FOB Shanghai')}</strong>
                </div>
                <div>
                    <span>Saved</span>
                    <strong>${escapeHtml(savedDate)}</strong>
                </div>
                <div class="record-actions">
                    <button class="small-button load-record-button" type="button" data-record-id="${escapeHtml(record.contractNumber)}">Load / 载入</button>
                    <button class="small-button delete-record-button" type="button" data-record-id="${escapeHtml(record.contractNumber)}">Delete / 删除</button>
                </div>
            </article>
        `;
    }).join('');
}

function saveRecord() {
    const record = collectFormData();
    const records = readRecords().filter((item) => item.contractNumber !== record.contractNumber);
    records.unshift(record);
    writeRecords(records);
    renderRecords();
}

function buildClauses(data) {
    const russianContract = isRussianContract(data.languagePair);

    const clauses = [
        { ru: `2. Условия поставки: ${data.tradeTerm}`, zh: `2. 成交价格术语：${data.tradeTerm}`, en: `2. Terms: ${data.tradeTerm}` },
        { ru: '3. Упаковка: стандартная экспортная морская упаковка, пригодная для дальних морских перевозок.', zh: '3. 包装：适合于海洋运输的标准出口包装。', en: '3. Packing: To be packed in sea-worthy package suitable for distance ocean transportation.' },
        { ru: '4. Маркировка груза: N/M', zh: '4. 装运唛头：N/M', en: '4. Shipping Marks: N/M' },
        { ru: '5. Перевалка: не допускается; частичная отгрузка: не допускается.', zh: '5. 转运：不允许；分批装运：不允许。', en: '5. Transshipment: Not Allowed; Partial shipments: Not allowed.' },
        { ru: `6. Срок отгрузки: после получения продавцом оплаты и подтвержденных сторонами строительных и технических параметров отгрузка будет произведена на заводе продавца в течение ${data.shipmentDays} дней.`, zh: `6. 装运期：卖方收到货款和双方确认的土建及技术参数后，${data.shipmentDays} 天内在公司装运。`, en: `6. Shipment date: upon the sellers receiving the payment and approved layout drawing and specifications by both parties, within ${data.shipmentDays} days the shipment will be effected in Seller’s Factory.` },
        { ru: `7. Условия оплаты: ${data.paymentTerms}`, zh: `7. 付款方式：${data.paymentTerms}`, en: `7. Payment terms: ${data.paymentTerms}` },
        { ru: '8. Страхование: осуществляется покупателем.', zh: '8. 保险：由买方负责。', en: '8. Insurance: To be covered by the buyer.' },
        { ru: '9. Требуемые документы: коносамент, коммерческий инвойс, сертификат происхождения и упаковочный лист согласно требованиям договора.', zh: '9. 单据要求：卖方应按合同要求提供提单、商业发票、原产地证和装箱单。', en: '9. Documents Required: Full set of clean on board ocean Bills of Lading, commercial invoice, certificate of origin and packing list according to contract requirements.' },
        { ru: '10. Уведомление об отгрузке: после завершения погрузки продавец уведомляет покупателя по электронной почте о номере договора, наименовании товара, количестве, сумме инвойса, весе брутто, транспортном средстве и дате отгрузки.', zh: '10. 装运通知：装运完成后，卖方应以电子邮件通知买方合同号、品名、数量、发票金额、毛重、运输工具及启运日期。', en: '10. Shipping advice: The sellers shall advise the buyers of contract number, commodity, loaded quantity, invoice value, gross weight, vessel and shipment date by email after loading.' },
        { ru: '11. Гарантия: 18 месяцев с даты завершения монтажа, но не более 24 месяцев с даты отгрузки с завода продавца.', zh: '11. 质量保证期：安装完毕之日起十八个月，但最迟不超过卖方出货期后二十四个月。', en: "11. Warranty: 18 months since installation finish but not over than 24 months after shipment date from the sellers' factory." },
        { ru: '12. Инспекция и претензии: претензии по качеству или количеству должны быть предъявлены в течение 30 дней после прибытия товара в порт назначения.', zh: '12. 检验与索赔：品质或数量异议须于货到目的口岸之日起 30 天内提出。', en: '12. Inspection and Claims: Claims for quality or quantity discrepancy shall be raised within 30 days after arrival at the port of destination.' },
        { ru: '13. Форс-мажор: продавец не несет ответственности за частичное или полное неисполнение договора вследствие форс-мажора, но обязан своевременно уведомить покупателя.', zh: '13. 人力不可抗拒：因不可抗力造成不能履约，卖方不承担责任，但应及时通知买方。', en: '13. Force Majeure: The sellers shall not hold responsibility for partial or total non-performance due to Force Majeure, but shall advise the buyers in time.' },
        { ru: '14. Разрешение споров: споры передаются в CIETAC для арбитража в Шанхае, Китай. Арбитражное решение является окончательным и обязательным для обеих сторон.', zh: '14. 争议解决：提交中国国际经济贸易仲裁委员会在中国上海仲裁，裁决为终局并对双方有约束力。', en: '14. Disputes settlement: Disputes shall be submitted to CIETAC for arbitration in Shanghai, China. The arbitral award is final and binding upon both parties.' },
        { ru: '15. Применимое право: настоящий договор регулируется законодательством Китайской Народной Республики и, где применимо, Конвенцией ООН о договорах международной купли-продажи товаров.', zh: '15. 法律适用：本合同适用中华人民共和国法律，并在适用时适用《联合国国际货物销售公约》。', en: '15. Law application: This contract shall be governed by the law of the People’s Republic of China and, where applicable, the United Nations Convention on Contracts for the International Sale of Goods.' },
        { ru: '16. Языки: настоящий договор составлен на русском, китайском и английском языках. Все языковые версии имеют одинаковую юридическую силу; при расхождениях преимущественную силу имеет китайская версия.', zh: '16. 文字：本合同俄、中、英三种文字具有同等法律效力，在文字解释上若有异议，以中文解释为准。', en: '16. Versions: This contract is made out in Russian, Chinese and English, all versions being equally effective. In case of discrepancy, the Chinese version shall prevail.' },
        { ru: '17. Дополнительные условия: при противоречии между основными и дополнительными условиями преимущественную силу имеют дополнительные условия.', zh: '17. 附加条款：本合同上述条款与附加条款有抵触时，以附加条款为准。', en: '17. Additional Clauses: Conflicts between contract clauses and additional clauses, if any, are subject to the additional clauses.' },
        { ru: '18. Настоящий договор составлен в 2 экземплярах и вступает в силу с даты подписания / проставления печатей обеими сторонами.', zh: '18. 本合同共贰份，自双方代表签字（盖章）之日起生效。', en: '18. This contract is in 2 copies, effective since being signed / sealed by both parties.' },
        { ru: `19. Технические характеристики см. в приложениях. Все приложения являются неотъемлемой частью настоящего договора. ${data.attachments}`, zh: '19. 有关的技术规格和参数见附件，所有附件均为本合同不可分割的部分。', en: `19. ${data.attachments}` }
    ];

    return clauses.map((clause) => `
        <div class="clause">
            ${russianContract ? `<p>${escapeHtml(clause.ru)}</p>` : ''}
            <p>${escapeHtml(clause.zh)}</p>
            <p>${escapeHtml(clause.en)}</p>
        </div>
    `).join('');
}

function renderSpecificationAppendix(quote) {
    const appendix = document.getElementById('specification-appendix');
    if (!quote || !quote.items.length) {
        appendix.innerHTML = '';
        return;
    }

    appendix.innerHTML = `
        <div class="appendix-cover">
            <p>附件 / Appendix</p>
            <h2>Specification</h2>
            <span>${escapeHtml(quote.quotationNo)}${quote.customerName ? ` · ${escapeHtml(quote.customerName)}` : ''}</span>
        </div>
        ${quote.items.map((item, index) => {
            const imageSource = imageSourceForItem(item);
            const specs = item.specifications.length
                ? item.specifications
                : [
                    { parameter: 'Product', value: item.name },
                    { parameter: 'Description', value: item.description || '-' },
                    { parameter: 'Quantity', value: item.quantity || '-' }
                ];
            return `
                <article class="spec-page">
                    <header class="spec-page-head">
                        <span>Specification ${index + 1}</span>
                        <h3>${escapeHtml(item.name)}</h3>
                        <p>${escapeHtml(item.description || '-')}</p>
                    </header>
                    <div class="spec-detail-grid">
                        <div class="spec-image-box">
                            ${imageSource ? `<img src="${escapeHtml(imageSource)}" alt="${escapeHtml(item.name)}">` : '<span>Product image</span>'}
                        </div>
                        <table class="spec-table">
                            <tbody>
                                ${specs.map((spec) => `
                                    <tr>
                                        <th>${escapeHtml(spec.parameter || '-')}</th>
                                        <td>${escapeHtml(spec.value || '-')}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ${item.advantages.length ? `
                        <section class="spec-advantages">
                            <h4>Key Advantages</h4>
                            <ul>
                                ${item.advantages.map((advantage) => `<li>${escapeHtml(advantage)}</li>`).join('')}
                            </ul>
                        </section>
                    ` : ''}
                </article>
            `;
        }).join('')}
    `;
}

function updatePreview() {
    const data = collectFormData();
    const lineItems = data.lineItems;
    const total = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const currency = currencySettings[data.currency] || currencySettings.USD;
    const russianContract = isRussianContract(data.languagePair);
    const paper = document.getElementById('contract-paper');

    paper.classList.toggle('is-russian-contract', russianContract);
    renderGoodsHead(russianContract);
    setText('preview-secondary-title', russianContract ? 'ДОГОВОР КУПЛИ-ПРОДАЖИ / 销售合同' : '销售合同');
    setText('preview-english-title', 'SALES CONTRACT');
    setText('preview-contract-number', data.contractNumber);
    setText('preview-contract-number-local', russianContract ? `№ договора: ${data.contractNumber} / 合同号：${data.contractNumber}` : `合同号：${data.contractNumber}`);
    setText('preview-signed-at', data.signedAt);
    setText('preview-signed-at-local', russianContract ? `Место подписания: ${data.signedAt} / 签订地：${data.signedAt}` : `签订地：${data.signedAt}`);
    setText('preview-date', russianContract ? formatRussianDate(data.contractDate) : formatDate(data.contractDate));
    setText('preview-date-local', russianContract ? `Дата: ${formatRussianDate(data.contractDate)} / 日期：${formatLocalDate(data.contractDate)}` : `日期：${formatLocalDate(data.contractDate)}`);
    setText('preview-buyer-name', data.buyerName || 'Buyer Not Provided');
    setText('preview-buyer-address', data.buyerAddress || ' ');
    setText('preview-buyer-tel', data.buyerTel || ' ');
    setText('preview-buyer-email', data.buyerEmail || ' ');
    setText('preview-party-note', partyNotice[russianContract ? 'ru-zh-en' : 'zh-en']);
    setText('preview-total-label', `TOTAL / ${data.tradeTerm}`);
    setText('preview-total', formatMoney(total));
    setText('preview-total-local-label', russianContract ? 'Итого / 总值（大写）：' : '总值（大写）：');
    setText('preview-total-local', approximateChineseAmount(total));
    setText('preview-total-words', `SAY ${currency.symbol} ${numberToEnglishWords(total)} ${currency.english} ONLY`);

    document.getElementById('preview-lines').innerHTML = lineItems.map((item) => `
        <tr>
            <td>${escapeHtml(item.artNo)}</td>
            <td>${escapeHtml(item.description)}</td>
            <td>${escapeHtml(item.unit)}</td>
            <td>${escapeHtml(item.quantity)}</td>
            <td>${escapeHtml(formatMoney(item.price))}</td>
            <td>${escapeHtml(formatMoney(item.amount))}</td>
        </tr>
    `).join('');

    const priceNote = data.priceNote
        ? `<div class="clause">${russianContract ? '<p>Указанная выше цена включает стоимость оборудования и доставку до указанного порта / места поставки.</p>' : ''}<p>上述价格包括设备价及至约定港口 / 交货地点的费用。</p><p>${escapeHtml(data.priceNote)}</p></div>`
        : '';
    document.getElementById('preview-clauses').innerHTML = priceNote + buildClauses(data);

    setText('preview-bank', data.beneficiaryBank);
    setText('preview-bank-address', data.bankAddress);
    setText('preview-account', data.accountNumber);
    setText('preview-swift', data.swiftCode);
    setText('preview-intermediary', data.intermediaryBank);
    setText('preview-intermediary-swift', data.intermediarySwift);
    renderSpecificationAppendix(selectedQuotation());
}

function resetForm() {
    form.reset();
    document.getElementById('contract-date').value = todayValue();
    document.getElementById('contract-number').value = defaultContractNumber();
    replaceLineItems(defaultLines);
    updatePreview();
}

function exportPdf() {
    updatePreview();
    const originalTitle = document.title;
    document.title = `Sales Contract ${textValue('contract-number') || defaultContractNumber()}`;
    window.print();
    window.setTimeout(() => {
        document.title = originalTitle;
    }, 1000);
}

addLineButton.addEventListener('click', () => {
    createLineItem();
    updatePreview();
});

form.addEventListener('input', updatePreview);
form.addEventListener('change', updatePreview);
form.addEventListener('submit', (event) => event.preventDefault());
resetButton.addEventListener('click', resetForm);
saveRecordButton.addEventListener('click', saveRecord);
pdfButton.addEventListener('click', exportPdf);
printPreviewButton.addEventListener('click', exportPdf);
refreshQuotesButton.addEventListener('click', () => {
    const selectedId = quoteSelect.value;
    loadQuotationHistory();
    renderQuoteSelect(selectedId);
    updatePreview();
});
quoteSelect.addEventListener('change', () => {
    includeSpecificationInput.checked = Boolean(quoteSelect.value);
    updatePreview();
});
includeSpecificationInput.addEventListener('change', updatePreview);

recordsList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-record-id]');
    if (!button) return;

    const recordId = button.dataset.recordId;
    const records = readRecords();

    if (button.classList.contains('load-record-button')) {
        const record = records.find((item) => item.contractNumber === recordId);
        if (record) applyRecord(record);
        return;
    }

    if (button.classList.contains('delete-record-button')) {
        writeRecords(records.filter((item) => item.contractNumber !== recordId));
        renderRecords();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadQuotationHistory();
    document.getElementById('contract-date').value = todayValue();
    document.getElementById('contract-number').value = defaultContractNumber();
    replaceLineItems(defaultLines);
    updatePreview();
    renderRecords();
});
