import { fetcher } from "@/lib/coingecko.actions";
import Image from "next/image";
import { CoinOverviewFallback } from "../home/fallback";
import CandlestickChart from "../CandlestickChart";

async function CoinOverview() {
  try {
    const [coin, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>("coins/bitcoin", {
        dex_pair_format: "symbol",
      }),
      fetcher<OHLCData[]>("coins/bitcoin/ohlc", {
        vs_currency: "usd",
        days: 180, // 1, 7 , 14, 30, 90, 180, 365, max
        precision: "full",
      }),
    ]);

    return (
      <div id="coin-overview">
        <CandlestickChart data={coinOHLCData} coinId="bitcoin">
          <div className="header pt-2">
            <Image
              src={coin.image.large}
              alt={`${coin.name} Logo`}
              width={56}
              height={56}
            />
            <div className="info">
              <p>
                {coin.name} / {coin.symbol.toUpperCase()}
              </p>
              <h1>${coin.market_data.current_price.usd.toFixed(2)}</h1>
            </div>
          </div>
        </CandlestickChart>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch coin overview:", error);
    return <CoinOverviewFallback />;
  }
}

export default CoinOverview;
