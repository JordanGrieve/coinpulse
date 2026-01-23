import { Skeleton } from "@/components/skeleton";
import DataTable from "../DataTable";

export function CoinOverviewFallback() {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <Skeleton className="header-image" />
        <div className="info">
          <Skeleton className="header-line-sm" />
          <Skeleton className="header-line-lg" />
        </div>
      </div>
      <div className="flex gap-1 my-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="period-button-skeleton" />
        ))}
      </div>
      <div className="chart">
        <Skeleton className="chart-skeleton" />
      </div>
    </div>
  );
}

export function CategoriesFallback() {
  const columns: DataTableColumn<number>[] = [
    {
      header: "Category",
      cellClassName: "category-cell",
      cell: () => <Skeleton className="category-line" />,
    },
    {
      header: "Top Gainers",
      cellClassName: "top-gainers-cell",
      cell: () => (
        <div className="flex">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="top-gainer-image" />
          ))}
        </div>
      ),
    },
    {
      header: "24h Change",
      cellClassName: "change-header-cell",
      cell: () => (
        <div className="price-change">
          <Skeleton className="change-line" />
        </div>
      ),
    },
    {
      header: "Market Cap",
      cellClassName: "market-cap-cell",
      cell: () => <Skeleton className="market-cap-line" />,
    },
    {
      header: "24h Volume",
      cellClassName: "volume-cell",
      cell: () => <Skeleton className="volume-line" />,
    },
  ];

  return (
    <div id="categories-fallback" className="custom-scrollbar">
      <h4>Top Categories</h4>
      <DataTable
        columns={columns}
        data={Array.from({ length: 10 }, (_, i) => i)}
        rowKey={(_, index) => index}
        tableClassName="mt-3"
      />
    </div>
  );
}

export function TrendingCoinsFallback() {
  const columns: DataTableColumn<number>[] = [
    {
      header: "Name",
      cellClassName: "name-cell",
      cell: () => (
        <div className="name-link">
          <Skeleton className="name-image" />
          <Skeleton className="name-line" />
        </div>
      ),
    },
    {
      header: "24h Change",
      cellClassName: "change-cell",
      cell: () => (
        <div className="price-change">
          <Skeleton className="change-icon" />
          <Skeleton className="change-line" />
        </div>
      ),
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: () => <Skeleton className="price-line" />,
    },
  ];

  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <DataTable
        columns={columns}
        data={Array.from({ length: 6 }, (_, i) => i)}
        rowKey={(_, index) => index}
        tableClassName="trending-coins-table"
        headerCellClassName="py-3!"
        bodyCellClassName="py-2!"
      />
    </div>
  );
}
