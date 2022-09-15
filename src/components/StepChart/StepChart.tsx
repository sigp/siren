import {FC, useEffect, useRef, useState} from "react";

import {
  CategoryScale,
  Chart as ChartJS,
  Chart,
  Filler,
  Legend,
  LinearScale, LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LineController,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

export type DataSet = {
  borderColor: string,
  backgroundColor: string,
  label: string,
  data: number[],
  fill: boolean,
  pointRadius: number,
  stepped: string}

export type ChartData = {
  labels: string[],
  datasets: DataSet[]
}

export interface StepChartProps {
  data: ChartData
}

const StepChart:FC<StepChartProps> = ({data}) => {
  const chartEl = useRef(null);

  const [chart, setChart] = useState<Chart>();

  useEffect(() => {
    if(chart) {
      chart.destroy();
      setChart(undefined)
    }
    const ctx = chartEl.current;

    if(!ctx) return;

    const config = {
      type: 'line' as any,
      data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        interaction: {
          intersect: false,
          axis: 'x'
        },
        scales: {
          x: {
            grid: {
              color: '#F3F5FB',
            }
          },
          y: {
            grid: {
              color: '#F3F5FB',
            }
          }
        }
      }
    };

    setChart(new ChartJS(ctx, config));

    return () => {
      chart?.destroy();
      setChart(undefined)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartEl, data]);


  return (
      <canvas ref={chartEl} width="100%" height={45}/>
  )
}

export default StepChart;