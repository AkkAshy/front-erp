import type { FC } from "react";
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#8E51FFCC", "#8E51FF99", "#8E51FF66", "#8E51FF33"];
const CENTER_COLOR = "#8E51FF";

type Props = {
  pieChartData: { name: string; value: number }[];
};

const RadialChart: FC<Props> = ({
  pieChartData = [
    { name: "Umumiy", value: 1 },
    { name: "", value: 1 },
  ],
}) => {
  const innerData = pieChartData.filter((item) => item.name === "Umumiy");
  const outerData = pieChartData.filter((item) => item.name !== "Umumiy");

  return (
    <PieChart width={460} height={460}>
      {/* Outer pie (segments) */}
      <Pie
        data={outerData}
        dataKey="value"
        cx="50%"
        cy="50%"
        innerRadius={86.5}
        outerRadius={230}
        startAngle={180}
        endAngle={-180}
        cornerRadius={12}
      >
        {outerData.map((_, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
            stroke="white"
            strokeWidth={2.5}
          />
        ))}
      </Pie>

      {/* Inner pie (center circle) */}
      <Pie
        data={innerData}
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius={85}
        fill={CENTER_COLOR}
        stroke="none"
        strokeWidth={2.5}
        startAngle={180}
        endAngle={-180}
        cornerRadius={12}
        isAnimationActive={false}
      />
    </PieChart>
  );
};

export default RadialChart;
