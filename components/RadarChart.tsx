
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Stats } from '../types';

interface RadarChartProps {
  stats: Stats;
}

const RadarChart: React.FC<RadarChartProps> = ({ stats }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 200;
    const height = 200;
    const margin = 30;
    const radius = Math.min(width, height) / 2 - margin;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const data = [
      { axis: "生存", value: stats.survival },
      { axis: "智慧", value: stats.intellect },
      { axis: "社交", value: stats.social },
      { axis: "理智", value: stats.sanity },
      { axis: "运气", value: stats.luck },
    ];

    const angleStep = (Math.PI * 2) / data.length;

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Draw background circles/polygons
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius / levels) * i;
      const points = data.map((_, idx) => {
        const angle = idx * angleStep - Math.PI / 2;
        return [
          levelRadius * Math.cos(angle),
          levelRadius * Math.sin(angle)
        ];
      });
      g.append("polygon")
        .attr("points", points.map(p => p.join(",")).join(" "))
        .attr("fill", "none")
        .attr("stroke", "#2d3748")
        .attr("stroke-width", "1px");
    }

    // Draw axes
    data.forEach((d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "#4a5568");

      g.append("text")
        .attr("x", (radius + 15) * Math.cos(angle))
        .attr("y", (radius + 15) * Math.sin(angle))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "10px")
        .attr("fill", "#a0aec0")
        .text(d.axis);
    });

    // Draw the actual radar shape
    const radarPoints = data.map((d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (d.value / 100) * radius;
      return [r * Math.cos(angle), r * Math.sin(angle)];
    });

    g.append("polygon")
      .attr("points", radarPoints.map(p => p.join(",")).join(" "))
      .attr("fill", "rgba(96, 165, 250, 0.3)")
      .attr("stroke", "#60a5fa")
      .attr("stroke-width", "2px");

    // Add points
    radarPoints.forEach(p => {
      g.append("circle")
        .attr("cx", p[0])
        .attr("cy", p[1])
        .attr("r", 3)
        .attr("fill", "#60a5fa");
    });

  }, [stats]);

  return (
    <div className="flex justify-center items-center bg-gray-900/50 rounded-lg p-2 border border-gray-800">
      <svg ref={svgRef} width="200" height="200"></svg>
    </div>
  );
};

export default RadarChart;
