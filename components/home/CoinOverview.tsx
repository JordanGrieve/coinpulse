import { fetcher } from "@/lib/coingecko.actions";
import Image from "next/image";

async function CoinOverview() {
  let coin: CoinDetailsData | null = null;

  try {
    coin = await fetcher<CoinDetailsData>("coins/bitcoin", {
      dex_pair_format: "symbol",
    });
  } catch (error) {
    console.error("Failed to fetch coin overview:", error);
  }

  if (!coin) {
    return (
      <div id="coin-overview">
        <div className="header pt-2">
          <div className="size-14 rounded-full bg-dark-400" />
          <div className="info">
            <p className="text-purple-100">Failed to load coin data</p>
            <h1 className="text-muted-foreground">--</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="coin-overview">
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
    </div>
  );
}

export default CoinOverview;
