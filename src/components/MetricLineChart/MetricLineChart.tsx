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
  const chartId = `metric-chart-${label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`

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

    // Create gradient fill for the chart
    const createGradient = () => {
      if (!chartEl.current) return color + '20'

      const ctx = chartEl.current.getContext('2d')
      if (!ctx) return color + '20'

      const gradient = ctx.createLinearGradient(0, 0, 0, chartEl.current.height)
      gradient.addColorStop(0, color + '60') // More opaque at top
      gradient.addColorStop(0.5, color + '30') // Medium opacity in middle
      gradient.addColorStop(1, color + '10') // Very transparent at bottom
      return gradient
    }

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
              backgroundColor: createGradient(),
              borderWidth: 2,
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 0,
              pointBackgroundColor: color,
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              tension: 0.4,
              shadowOffsetX: 0,
              shadowOffsetY: 2,
              shadowBlur: 4,
              shadowColor: `${color}40`,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: animate
            ? {
                duration: 1000,
                easing: 'easeInOutQuart',
              }
            : { duration: 0 },
          layout: {
            padding: {
              top: 5,
              right: 5,
              bottom: 5,
              left: showYAxis ? 10 : 5,
            },
          },
          scales: {
            x: {
              display: false,
              grid: {
                display: false,
              },
            },
            y: {
              display: showYAxis,
              min: yAxisConfig.min,
              max: yAxisConfig.max,
              border: {
                display: false,
              },
              grid: {
                display: showYAxis || showGrid,
                color: mode === UiMode.DARK ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                lineWidth: 1,
                drawBorder: false,
              },
              ticks: {
                display: showYAxis,
                color: mode === UiMode.DARK ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                font: {
                  size: 9,
                  family: 'system-ui, -apple-system, sans-serif',
                },
                maxTicksLimit: 3,
                padding: 8,
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
              enabled: true,
              mode: 'index',
              intersect: false,
              backgroundColor:
                mode === UiMode.DARK ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              titleColor: mode === UiMode.DARK ? '#ffffff' : '#000000',
              bodyColor: mode === UiMode.DARK ? '#ffffff' : '#000000',
              borderColor: color,
              borderWidth: 1,
              cornerRadius: 6,
              displayColors: false,
              titleFont: {
                size: 11,
              },
              bodyFont: {
                size: 11,
              },
              padding: 8,
              callbacks: {
                title: () => label,
                label: function (context: any) {
                  const value = context.parsed.y
                  if (isPercentage) {
                    return `${value.toFixed(1)}%`
                  }
                  return `${value < 1 ? value.toFixed(2) : value.toFixed(1)}`
                },
              },
            },
          },
          elements: {
            point: {
              radius: 0,
              hoverRadius: 4,
              hoverBorderWidth: 2,
            },
            line: {
              borderCapStyle: 'round',
              borderJoinStyle: 'round',
            },
          },
          interaction: {
            intersect: false,
            mode: 'index',
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
