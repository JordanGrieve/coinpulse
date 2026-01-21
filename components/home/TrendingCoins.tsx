import { fetcher } from "@/lib/coingecko.actions";
import Link from "next/link";
import DataTable from "../DataTable";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";

async function TrendingCoins() {
  let trendingCoins: { coins: TrendingCoin[] } | null = null;

  try {
    trendingCoins = await fetcher<{ coins: TrendingCoin[] }>(
      "search/trending",
      undefined,
      300,
    );
  } catch (error) {
    console.error("Failed to fetch trending coins:", error);
  }

  if (!trendingCoins) {
    return (
      <div id="trending-coins">
        <h4>Trending Coins</h4>
        <div className="flex items-center justify-center py-8 text-purple-100">
          Failed to load trending coins
        </div>
      </div>
    );
  }

  const columns: DataTableColumn<TrendingCoin>[] = [
    {
      header: "Name",
      cellClassName: "name-cell",
      cell: (coin) => {
        const item = coin.item;
        return (
          <Link href={`/coins/${item.id}`}>
            <Image src={item.large} alt={item.name} width={36} height={36} />
            <p>{item.name}</p>
          </Link>
        );
      },
    },
    {
      header: "24h Change",
      cellClassName: "name-cell",
      cell: (coin) => {
        const item = coin.item;
        const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;

        return (
          <div
            className={cn(
              "price-change",
              isTrendingUp ? "text-green-500" : "text-red-500",
            )}
          >
            <p>
              {isTrendingUp ? (
                <TrendingUp width={16} height={16} />
              ) : (
                <TrendingDown width={16} height={16} />
              )}
              {Math.abs(item.data.price_change_percentage_24h.usd).toFixed(2)}%
            </p>
          </div>
        );
      },
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (coin) => {
        return <p>${coin.item.data.price.toFixed(2)}</p>;
      },
    },
  ];

  return (
    <div id="trending-coins">
      <h4>Trending Coin</h4>
      <DataTable
        columns={columns}
        data={trendingCoins.coins.slice(0, 6) || []}
        rowKey={(coin) => coin.item.id}
        tableClassName="trending-coins-table"
        headerCellClassName="py-3!"
        bodyCellClassName="py-2!"
      />
    </div>
  );
}

export default TrendingCoins;
