import React, {useEffect, useRef} from 'react';
import {Chart, PieController, ArcElement, Tooltip, Legend} from 'chart.js'
import exp from 'constants';


Chart.register(PieController,ArcElement,Tooltip,Legend);
interface PieChartProps {
  labels: string[];
  data: number[];
  backgroundColors: string[];
}
const PieChart: React.FC<PieChartProps> = ({ labels, data, backgroundColors }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (chartRef.current) {
      new Chart(chartRef.current, {
        type: 'pie',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: backgroundColors,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  return `${label}: ${value}`;
                },
              },
            },
          },
        },
      });
    }
  }, [labels, data, backgroundColors]);
  return <canvas ref={chartRef} />;
};
export default PieChart;