import { FC, useEffect, useRef, useState } from 'react'

import {
  CategoryScale,
  Chart as ChartJS,
  Chart,
  ChartType,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { useRecoilValue } from 'recoil'
import { uiMode } from '../../recoil/atoms'
import { UiMode } from '../../constants/enums'

ChartJS.register(
  CategoryScale,
  LineController,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
)

export type DataSet = {
  borderColor: string
  backgroundColor: string
  label: string
  data: number[]
  fill: boolean
  pointRadius: number
  stepped: string
}

export type ChartData = {
  labels: string[]
  datasets: DataSet[]
}

export interface StepChartProps {
  data: ChartData
}

const StepChart: FC<StepChartProps> = ({ data }) => {
  const chartEl = useRef(null)
  const mode = useRecoilValue(uiMode)
  const [hasAnimated, toggleAnimated] = useState(false)

  const [chart, setChart] = useState<Chart>()

  useEffect(() => {
    if (chart) {
      chart.destroy()
      setChart(undefined)
    }
    const ctx = chartEl.current

    if (!ctx) return

    const config = {
      type: 'line' as ChartType,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: hasAnimated ? 0 : 1500,
          onComplete: () => {
            if (data.datasets.length) {
              toggleAnimated(true)
            }
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: mode === UiMode.DARK ? 'rgba(0, 0, 0, .8)' : '#ffffff',
            bodyColor: mode === UiMode.DARK ? '#ffffff' : '#000000',
            titleColor: mode === UiMode.DARK ? '#ffffff' : '#000000',
          },
        },
        interaction: {
          intersect: false,
          axis: 'x',
        },
        scales: {
          x: {
            grid: {
              color: mode === UiMode.DARK ? 'rgba(255, 255, 255, 0.03)' : '#F3F5FB',
            },
          },
          y: {
            grid: {
              color: mode === UiMode.DARK ? 'rgba(255, 255, 255, 0.03)' : '#F3F5FB',
            },
          },
        },
      },
    }

    setChart(new ChartJS(ctx, config as never))

    return () => {
      chart?.destroy()
      setChart(undefined)
    }
  }, [chartEl, data, hasAnimated, mode])

  return (
    <div className="w-full h-full relative">
      <canvas ref={chartEl} />
    </div>
  )
}

export default StepChart
