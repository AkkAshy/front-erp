import { type FC } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// const generateYearData = () => {
//   const data = [];
//   // const year = 2025;
//   const months = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 2024 - високосный

//   for (let month = 0; month < 12; month++) {
//     for (let day = 1; day <= months[month]; day++) {
//       data.push({
//         date: `${day.toString().padStart(2, "0")}.${(month + 1)
//           .toString()
//           .padStart(2, "0")}`,
//         value: Math.floor(Math.random() * 900) + 100, // случайные значения от 100 до 1000
//       });
//     }
//   }

//   return data;
// };

// const yearData = generateYearData();

type dataType = { date: string; value: number };

type Props = {
  chartData: dataType[];
  period: string;
};

const getOptimalPoints = (period: string): number => {
  const pointsMap: Record<string, number> = {
    "15d": 15, // все дни
    "1m": 30, // все дни
    "3m": 30, // ~каждые 3 дня
    "6m": 30, // ~каждые 6 дней
    "1y": 24, // ~2 точки в месяц
  };

  return pointsMap[period] || 30;
};

const SalesChart: FC<Props> = ({
  chartData = [{ date: "", value: 1 }],
  period,
}) => {
  const maxPoints = getOptimalPoints(period);
  const step = Math.ceil(chartData.length / maxPoints);
  const optimizedData = chartData.filter((_, i) => i % step === 0);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <LineChart
          data={
            optimizedData.length > 0 ? optimizedData : [{ date: "", value: 1 }]
          }
          // data={optimizedData}
          margin={{ left: 70, top: 10, bottom: 30, right: 20 }}
        >
          <CartesianGrid stroke="#E2E8F0" />
          <XAxis
            // domain={['dataMin', 'auto']}
            tick={{ fill: "#0F1C3D", fontSize: 16, fontWeight: 400, dy: 20 }}
            axisLine={{ stroke: "#E2E8F0", strokeWidth: 1 }}
            tickLine={{ stroke: "#0F1C3D", strokeWidth: 1 }}
            tickSize={13}
            dataKey="date"
          />
          <YAxis
            tick={{ fill: "#0F1C3D", fontSize: 18, fontWeight: 400, dx: -10 }}
            axisLine={{ stroke: "#E2E8F0", strokeWidth: 1 }}
            tickLine={{ stroke: "#0F1C3D", strokeWidth: 1 }}
            tickSize={13}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <Tooltip
            contentStyle={{
              display:"flex",
              flexDirection:"column",
              backgroundColor: "#fff",
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              fontSize: 18,
              fontWeight: 500,
            }}
            labelStyle={{ color: "#8E51FF" }}
            itemStyle={{ color: "#8E51FF", lineHeight: 1 }}
            formatter={(value) => [
              `${value.toLocaleString("de-DE")} uzs`,
              "Sotuvlar",
            ]}
          />
          <Line
            type="linear"
            dataKey="value"
            stroke="#8E51FF"
            strokeWidth={2}
            dot={{ stroke: "#8E51FF", strokeWidth: 2, fill: "#fff", r: 6.5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
