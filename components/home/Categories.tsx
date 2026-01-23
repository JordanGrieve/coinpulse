import { fetcher } from "@/lib/coingecko.actions";
import DataTable from "../DataTable";
import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react";

const Categories = async () => {
  let categories: Category[] | null = null;
  let error: string | null = null;

  try {
    categories = await fetcher<Category[]>("coins/categories");
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    error = err instanceof Error ? err.message : "Failed to load categories";
  }

  if (error || !categories) {
    return (
      <div id="categories" className="custom-scrollbar">
        <h4>Top Categories</h4>
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <AlertCircle className="w-10 h-10 mb-2" />
          <p>Unable to load categories</p>
          <p className="text-sm">{error || "Please try again later"}</p>
        </div>
      </div>
    );
  }

  const columns: DataTableColumn<Category>[] = [
    {
      header: "Category",
      cellClassName: "category-cell",
      cell: (category) => category.name,
    },
    {
      header: "Top Gainers",
      cellClassName: "top-gainers-cell",
      cell: (category) =>
        category.top_3_coins.map((coin) => (
          <Image src={coin} alt={coin} width={28} height={28} key={coin} />
        )),
    },
    {
      header: "24h Change",
      cellClassName: "change-header-cell",
      cell: (category) => {
        const isTrendingUp = category.market_cap_change_24h > 0;

        return (
          <div
            className={cn(
              "price-change",
              isTrendingUp ? "text-green-500" : "text-red-500",
            )}
          >
            <p className="flex items-center gap-1">
              {Math.abs(category.market_cap_change_24h).toFixed(2)}%
              {isTrendingUp ? (
                <TrendingUp width={16} height={16} />
              ) : (
                <TrendingDown width={16} height={16} />
              )}
            </p>
          </div>
        );
      },
    },
    {
      header: "Market Cap",
      cellClassName: "market-cap-cell",
      cell: (category) => formatCurrency(category.market_cap),
    },
    {
      header: "24h Volume",
      cellClassName: "volume-cell",
      cell: (category) => formatCurrency(category.volume_24h),
    },
  ];

  return (
    <div id="categories" className="custom-scrollbar">
      <h4>Top Categories</h4>

      <DataTable
        columns={columns}
        data={categories?.slice(0, 10)}
        rowKey={(_, index) => index}
        tableClassName="mt-3"
      />
    </div>
  );
};

export default Categories;
