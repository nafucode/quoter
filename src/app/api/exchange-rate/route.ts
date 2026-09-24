import { NextResponse } from 'next/server';

const NGN_MARKUP = 50;
const NGN_FALLBACK_MARKET_RATE = 1410;
const USD_RMB_ADJUSTMENT = 0.05;
const USD_RMB_FALLBACK = 6.65;

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .trim();

export const parseBocUsdSpotBuyingRate = (html: string) => {
  const rowMatch = html.match(/<tr[^>]*data-currency=["']美元["'][^>]*>([\s\S]*?)<\/tr>/i);
  if (!rowMatch?.[1]) return null;

  const cells = Array.from(rowMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map((match) =>
    stripHtml(match[1]),
  );
  const spotBuyingRate = Number(cells[1]);

  if (!Number.isFinite(spotBuyingRate) || spotBuyingRate <= 0) return null;
  return {
    rate: Number((spotBuyingRate / 100).toFixed(4)),
    updatedAt: cells[6] || '',
  };
};

const fetchUsdRmbBasis = async (bank: string) => {
  if (bank === 'szrcb') {
    try {
      const response = await fetch('https://www.szrcb.com/eportal/ui?moduleId=5&portal.url=/portlet/integrate!forex.portlet', {
        signal: AbortSignal.timeout(10000),
        next: { revalidate: 300 },
      });
      if (!response.ok) throw new Error('Bank request failed');
      const payload = await response.json();
      const row = payload.code === 0 && Array.isArray(payload.data)
        ? payload.data.find((item: { Ccy?: number; CcyNm?: string }) => Number(item.Ccy) === 14 && item.CcyNm === '美元')
        : null;
      const rate = Number((Number(row?.SpotExgBuyPrc) / 100).toFixed(4));
      if (!Number.isFinite(rate) || rate <= USD_RMB_ADJUSTMENT) throw new Error('Invalid bank rate');
      return {
        usdRmbBasis: Number((rate - USD_RMB_ADJUSTMENT).toFixed(4)),
        usdRmbMarketRate: rate,
        usdRmbAdjustment: USD_RMB_ADJUSTMENT,
        usdRmbUpdatedAt: '',
        usdRmbSource: '苏州农商行美元汇买价 - 0.05',
      };
    } catch {
      return {
        usdRmbBasis: null,
        usdRmbMarketRate: null,
        usdRmbAdjustment: USD_RMB_ADJUSTMENT,
        usdRmbUpdatedAt: '',
        usdRmbSource: '苏州农商行数据暂不可用，保留当前汇率',
      };
    }
  }
  try {
    const response = await fetch('https://www.boc.cn/sourcedb/whpj/', {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; XinfujiQuoter/1.0)',
      },
      next: { revalidate: 60 * 30 },
    });

    if (response.ok) {
      const parsed = parseBocUsdSpotBuyingRate(await response.text());
      if (parsed) {
        return {
          usdRmbBasis: Number((parsed.rate - USD_RMB_ADJUSTMENT).toFixed(4)),
          usdRmbMarketRate: parsed.rate,
          usdRmbAdjustment: USD_RMB_ADJUSTMENT,
          usdRmbUpdatedAt: parsed.updatedAt,
          usdRmbSource: '中国银行美元现汇买入价 - 0.05',
        };
      }
    }
  } catch {
    // Fall through to the stable default below.
  }

  return {
    usdRmbBasis: USD_RMB_FALLBACK,
    usdRmbMarketRate: null,
    usdRmbAdjustment: USD_RMB_ADJUSTMENT,
    usdRmbUpdatedAt: '',
    usdRmbSource: '默认汇率（中国银行数据暂不可用）',
  };
};

const parseNgnMarketRate = (html: string) => {
  const patterns = [
    /Sell:\s*₦\s*([\d,]+(?:\.\d+)?)/i,
    /sell\s+and\s+₦?\s*([\d,]+(?:\.\d+)?)/i,
    /sell\s+rate[^₦\d]*₦?\s*([\d,]+(?:\.\d+)?)/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      const value = Number(match[1].replace(/,/g, ''));
      if (Number.isFinite(value) && value > 0) return value;
    }
  }

  return null;
};

const fetchNgnRate = async () => {
  try {
    const response = await fetch('https://www.ngnrates.com/market/exchange-rates/us-dollar-to-naira/black-market', {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; XinfujiQuoter/1.0)',
      },
      next: { revalidate: 60 * 30 },
    });

    if (response.ok) {
      const html = await response.text();
      const marketRate = parseNgnMarketRate(html);
      if (marketRate) {
        return {
          rate: Math.round((marketRate + NGN_MARKUP) * 100) / 100,
          marketRate,
          markup: NGN_MARKUP,
          source: 'NGN market sell rate + markup',
        };
      }
    }
  } catch {
    // Fall through to the XT reference fallback below.
  }

  return {
    rate: NGN_FALLBACK_MARKET_RATE + NGN_MARKUP,
    marketRate: NGN_FALLBACK_MARKET_RATE,
    markup: NGN_MARKUP,
    source: 'XT reference fallback + markup',
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currency = (searchParams.get('currency') || 'USD').toUpperCase();
  const bank = searchParams.get('bank') === 'boc' ? 'boc' : 'szrcb';
  const usdRmb = await fetchUsdRmbBasis(bank);

  if (!currency || currency === '-' || currency === 'USD') {
    return NextResponse.json({ rate: 1, source: 'USD base', ...usdRmb });
  }

  if (currency === 'NGN') {
    return NextResponse.json({ ...(await fetchNgnRate()), ...usdRmb });
  }

  const response = await fetch('https://open.er-api.com/v6/latest/USD', {
    next: { revalidate: 60 * 30 },
  });
  const data = await response.json();
  const rate = data?.rates?.[currency];

  if (!rate) {
    return NextResponse.json({ error: `Rate not found for ${currency}` }, { status: 404 });
  }

  return NextResponse.json({ rate, source: 'open.er-api.com', ...usdRmb });
}
