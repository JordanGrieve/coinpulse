import Image from "next/image";
import { fetcher } from "@/lib/coingecko.actions";
import CandlestickChart from "@/components/CandlestickChart";
import CoinHeader from "./CoinHeader";

const LiveDataWrapper = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  const [coinData, coinOHLCData] = await Promise.all([
    fetcher<CoinDetailsData>(`/coins/${id}`, {
      dex_pair_format: "contract_address",
    }),
    fetcher<OHLCData[]>(`/coins/${id}/ohlc`, {
      vs_currency: "usd",
      days: 1,
      precision: "full",
    }),
  ]);
  return (
    <div id="coin-overview">
      <CoinHeader
        name={coinData.name}
        image={coinData.image.large}
        livePrice={coinData.market_data.current_price.usd}
        livePriceChangePercentage24h={
          coinData.market_data.price_change_percentage_24h
        }
        priceChangePercentage30d={
          coinData.market_data.price_change_percentage_30d
        }
        priceChange24h={coinData.market_data.price_change_24h}
      />
      <CandlestickChart data={coinOHLCData} coinId={id}>
        <div className="header pt-2">
          <Image
            src={coinData.image.large}
            alt={`${coinData.name} Logo`}
            width={56}
            height={56}
          />
          <div className="info">
            <p>
              {coinData.name} / {coinData.symbol.toUpperCase()}
            </p>
            <h1>${coinData.market_data.current_price.usd.toFixed(2)}</h1>
          </div>
        </div>
      </CandlestickChart>
    </div>
  );
};

export default LiveDataWrapper;
