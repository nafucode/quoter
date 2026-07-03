import { NextResponse } from 'next/server';

const NGN_MARKUP = 50;
const NGN_FALLBACK_MARKET_RATE = 1410;

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

  if (!currency || currency === '-' || currency === 'USD') {
    return NextResponse.json({ rate: 1, source: 'USD base' });
  }

  if (currency === 'NGN') {
    return NextResponse.json(await fetchNgnRate());
  }

  const response = await fetch('https://open.er-api.com/v6/latest/USD', {
    next: { revalidate: 60 * 30 },
  });
  const data = await response.json();
  const rate = data?.rates?.[currency];

  if (!rate) {
    return NextResponse.json({ error: `Rate not found for ${currency}` }, { status: 404 });
  }

  return NextResponse.json({ rate, source: 'open.er-api.com' });
}
