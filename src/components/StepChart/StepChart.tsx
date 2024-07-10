import {
  CategoryScale,
  Chart,
  ChartType,
  Filler,
  LinearScale,
  LineController,
  LogarithmicScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { FC, useEffect, useRef, useState } from 'react'

import { useRecoilValue } from 'recoil'
import addClassString from '../../../utilities/addClassString'
import { UiMode } from '../../constants/enums'
import { uiMode } from '../../recoil/atoms'
import Spinner from '../Spinner/Spinner'

Chart.register(
  CategoryScale,
  LineController,
  LogarithmicScale,
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
  stepSize?: number
  onClick?: () => void
  className?: string
}

const StepChart: FC<StepChartProps> = ({ data, stepSize, onClick, className }) => {
  const chartEl = useRef(null)
  const mode = useRecoilValue(uiMode)
  const [hasAnimated, toggleAnimated] = useState(false)
  const uiGridColor = mode === UiMode.LIGHT ? '#F3F5FB' : 'rgba(255, 255, 255, 0.03)'

  useEffect(() => {
    const ctx = chartEl.current

    if (!ctx) return

    const createChart = () => {
      Chart.getChart('stepChart')?.destroy()
      new Chart(ctx, config as never)
    }

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
            callbacks: {
              label: function (context: any) {
                let label = context.dataset.label || ''

                if (label) {
                  label += ': '
                }
                if (context.parsed.y !== null) {
                  label += context.raw
                }
                return label
              },
            },
          },
        },
        interaction: {
          intersect: false,
          axis: 'x',
        },
        scales: {
          x: {
            grid: {
              color: uiGridColor,
            },
          },
          y: {
            type: 'logarithmic',
            ticks: {
              stepSize,
            },
            grid: {
              color: uiGridColor,
            },
          },
        },
      },
    }

    try {
      createChart()
      window.addEventListener('resize', createChart)
    } catch (e) {
      console.error(e)
      createChart()
    }

    return () => {
      Chart.getChart('stepChart')?.destroy()
      window.removeEventListener('resize', createChart)
    }
  }, [chartEl, data, hasAnimated, mode, stepSize])

  useEffect(() => {
    return () => {
      Chart.getChart('stepChart')?.destroy()
    }
  }, [])

  return (
    <div onClick={onClick} className={addClassString('w-full h-full relative', [className])}>
      <canvas id='stepChart' ref={chartEl} />
      {!chartEl.current && (
        <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
          <Spinner />
        </div>
      )}
    </div>
  )
}

export default StepChart
