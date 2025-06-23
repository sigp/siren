import {
  CategoryScale,
  Chart,
  ChartType,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
} from 'chart.js'
import { FC, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { UiMode } from '../../constants/enums'
import { uiMode } from '../../recoil/atoms'

Chart.register(CategoryScale, LineController, LinearScale, PointElement, LineElement, Filler)

export interface MetricLineChartProps {
  data: number[]
  label: string
  color: string
  maxDataPoints?: number
  height?: number
  showGrid?: boolean
  animate?: boolean
  isPercentage?: boolean
  showYAxis?: boolean
}

const MetricLineChart: FC<MetricLineChartProps> = ({
  data,
  label,
  color,
  maxDataPoints = 20,
  height = 60,
  showGrid = false,
  animate = false,
  isPercentage = true,
  showYAxis = false,
}) => {
  const chartEl = useRef<HTMLCanvasElement>(null)
  const mode = useRecoilValue(uiMode)
  const chartId = `metric-chart-${Math.random().toString(36).substr(2, 9)}`

  useEffect(() => {
    if (!chartEl.current) return

    // Ensure we don't exceed max data points
    const displayData = data.slice(-maxDataPoints)
    const labels = Array.from({ length: displayData.length }, () => '')

    // Calculate dynamic Y-axis scaling
    const getYAxisConfig = () => {
      if (displayData.length === 0) {
        return { min: 0, max: isPercentage ? 100 : 10 }
      }

      const minValue = Math.min(...displayData)
      const maxValue = Math.max(...displayData)

      // Handle case where all values are the same (flat line)
      if (minValue === maxValue) {
        if (isPercentage) {
          const center = minValue
          const padding = Math.max(center * 0.1, 1) // 10% padding or at least 1%
          return {
            min: Math.max(0, center - padding),
            max: Math.min(100, center + padding),
          }
        } else {
          const center = minValue
          const padding = Math.max(center * 0.2, 1) // 20% padding or at least 1
          return {
            min: Math.max(0, center - padding),
            max: center + padding,
          }
        }
      }

      if (isPercentage) {
        // For percentages, use a tighter range around the data for better visualization
        const range = maxValue - minValue
        const padding = Math.max(range * 0.2, 1) // At least 1% padding
        return {
          min: Math.max(0, minValue - padding),
          max: Math.min(100, maxValue + padding),
        }
      } else {
        // For non-percentage data (like logs), use dynamic scaling
        const range = maxValue - minValue
        const padding = Math.max(range * 0.2, Math.max(maxValue * 0.1, 1))
        return {
          min: Math.max(0, minValue - padding),
          max: maxValue + padding,
        }
      }
    }

    const yAxisConfig = getYAxisConfig()

    const createChart = () => {
      Chart.getChart(chartId)?.destroy()

      const config = {
        type: 'line' as ChartType,
        data: {
          labels,
          datasets: [
            {
              label,
              data: displayData,
              borderColor: color,
              backgroundColor: `${color}30`, // Add transparency for fill
              borderWidth: 1.5,
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 0,
              tension: 0.4, // Smooth curves
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: animate ? undefined : { duration: 0 },
          scales: {
            x: {
              display: false,
            },
            y: {
              display: showYAxis,
              min: yAxisConfig.min,
              max: yAxisConfig.max,
              grid: {
                display: showYAxis || showGrid,
                color: mode === UiMode.DARK ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              },
              ticks: {
                display: showYAxis,
                color: mode === UiMode.DARK ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                font: {
                  size: 10,
                },
                maxTicksLimit: 3,
                callback: function (value: any) {
                  if (isPercentage) {
                    return value.toFixed(1) + '%'
                  }
                  return value < 1 ? value.toFixed(2) : value.toFixed(1)
                },
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
          elements: {
            point: {
              radius: 0,
            },
          },
          interaction: {
            intersect: false,
          },
        },
      }

      new Chart(chartEl.current!, config as never)
    }

    try {
      createChart()
    } catch (e) {
      console.error('MetricLineChart error:', e)
    }

    return () => {
      Chart.getChart(chartId)?.destroy()
    }
  }, [
    data,
    color,
    label,
    height,
    animate,
    isPercentage,
    maxDataPoints,
    showGrid,
    showYAxis,
    chartId,
    mode,
  ])

  useEffect(() => {
    return () => {
      Chart.getChart(chartId)?.destroy()
    }
  }, [chartId])

  return (
    <div className='w-full h-full'>
      <canvas id={chartId} ref={chartEl} />
    </div>
  )
}

export default MetricLineChart
