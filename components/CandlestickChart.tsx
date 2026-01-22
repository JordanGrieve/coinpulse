"use client";

import {
  getCandlestickConfig,
  getChartConfig,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
} from "@/constants";
import { fetcher } from "@/lib/coingecko.actions";
import { convertOHLCData, normalizeOHLCTimestamps } from "@/lib/utils";
import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import { useEffect, useRef, useState, useTransition } from "react";

function CandlestickChart({
  data,
  coinId,
  children,
  height = 360,
  initialPeriod = "daily",
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(initialPeriod);
  const [ohlcData, setOhlcData] = useState<OHLCData[] | undefined>(data ?? []);
  const [isPending, startTransition] = useTransition();

  // Track latest request to prevent race conditions when switching periods quickly
  const latestRequestIdRef = useRef(0);

  const fetchOHLCData = async (selectedPeriod: Period, requestId: number) => {
    try {
      const { days, interval } = PERIOD_CONFIG[selectedPeriod];
      const newData = await fetcher<OHLCData[]>(`coins/${coinId}/ohlc`, {
        vs_currency: "usd",
        days,
        precision: "full",
      });
      // Only update state if this is still the latest request
      if (requestId === latestRequestIdRef.current) {
        setOhlcData(newData ?? []);
      }
    } catch (error) {
      // Only log error if this is still the latest request
      if (requestId === latestRequestIdRef.current) {
        console.error("Failed to fetch OHLC data:", error);
      }
    }
  };

  const handlePeriodChange = async (newPeriod: Period) => {
    if (newPeriod === period) return;
    setPeriod(newPeriod);
    // Increment request ID to invalidate any pending requests
    const requestId = ++latestRequestIdRef.current;
    startTransition(async () => {
      await fetchOHLCData(newPeriod, requestId);
    });
  };

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const showTime = ["daily", "weekly", "monthly"].includes(period);

    const chart = createChart(container, {
      ...getChartConfig(height),
      width: container.clientWidth,
    });
    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

    series.setData(convertOHLCData(normalizeOHLCTimestamps(ohlcData || [])));
    chart.timeScale().fitContent();

    chartRef.current = chart;
    candleSeriesRef.current = series;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      chart.applyOptions({ width: entries[0].contentRect.width });
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [height]);

  useEffect(() => {
    if (!candleSeriesRef.current) return;

    const normalized = normalizeOHLCTimestamps(ohlcData || []);
    const converted = convertOHLCData(normalized);
    candleSeriesRef.current.setData(converted);
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [ohlcData, period]);

  return (
    <div id="candlestick-chart">
      <div className="chart-header">
        <div className="flex-1">{children}</div>

        <div className="button-group">
          <span className="text-sm mx-2 font-medium text-purple-100/50">
            Period:
          </span>
          {PERIOD_BUTTONS.map(({ value, label }) => (
            <button
              key={value}
              className={
                period === value ? "config-button-active" : "config-button"
              }
              onClick={() => handlePeriodChange(value)}
              disabled={loading}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="chart" style={{ height }} />
    </div>
  );
}

export default CandlestickChart;
