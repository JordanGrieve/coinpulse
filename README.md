# CoinPulse

A live crypto market dashboard: Bitcoin candlesticks and trending coins on the
home page, a paginated table of every coin by market cap, and a detail page per
coin with a live price header, a candlestick chart across six time ranges, and
a currency converter. Built to practise server-first data fetching in Next.js
against a rate-limited third-party API.

**Live:** [coinpulse-cyan.vercel.app](https://coinpulse-cyan.vercel.app)

## Stack

- Next.js 16 (App Router) and React 19, TypeScript
- Tailwind CSS 4 with Radix UI primitives (shadcn-style components)
- [lightweight-charts](https://github.com/tradingview/lightweight-charts) for the candlestick charts
- CoinGecko REST API (demo tier) for all market data
- Vercel for hosting

## What was hard

**Keeping the API key and the rate limit on the server.** Every CoinGecko
call goes through one server-side `fetcher` in `lib/coingecko.actions.ts`. It
attaches the key, so the browser never sees it, and sets a Next.js
`revalidate` window (60 seconds by default) so repeated page views are served
from the cache instead of spending the demo tier's request budget. The home
page splits its three data sections into separate `Suspense` boundaries, so a
slow or failed call for one section streams a skeleton rather than blocking
the page.

**Switching chart ranges without stale data winning.** Clicking 1D then 1M in
quick succession fires two requests, and the slower one can resolve last. The
chart keeps a request counter in a ref and only commits a response if it is
still the latest, inside a `useTransition` so the buttons stay responsive.

**Getting CoinGecko's OHLC data onto a TradingView chart.** CoinGecko returns
millisecond timestamps and lightweight-charts expects seconds, so the data is
normalised before it reaches the series. The chart is created once per mount
and resized through a `ResizeObserver`, with the series updated in place when
the range changes rather than tearing the chart down.

## Run locally

```bash
git clone https://github.com/JordanGrieve/coinpulse.git
cd coinpulse
npm install
```

Create `.env.local` with a free CoinGecko demo key:

```
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
COINGECKO_API_KEY=your_demo_key
```

Then:

```bash
npm run dev
```

Open http://localhost:3000.
