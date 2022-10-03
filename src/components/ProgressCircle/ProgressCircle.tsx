import { FC } from 'react'

export type ProgressColor = 'primary' | 'secondary'
export type ProgressDirection = 'clock' | 'counter'

export interface ProgressCircleProps {
  percent?: number
  color?: ProgressColor
  direction?: ProgressDirection
  size?: 'sm' | 'md' | 'xl'
  id: string
}

const ProgressCircle: FC<ProgressCircleProps> = ({
  percent = 0,
  id,
  color = 'primary',
  direction = 'clock',
  size = 'md',
}) => {
  const isMd = size === 'md'
  const isXL = size === 'xl'
  const radius = isXL ? 128 : isMd ? 20 : 18
  const circumference = radius * 2 * Math.PI
  const formattedPercentage = percent < 0 ? 0 : percent > 100 ? 100 : percent
  const offset = circumference - (formattedPercentage / 100) * circumference
  const strokeWidth = isXL ? 45 : 10
  const xy = isXL ? 128 : isMd ? 20 : 16
  const outerStroke = strokeWidth + (isXL ? 14 : 4)

  return (
    <div
      className={`inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full ${
        direction === 'clock' ? 'rotate-90' : 'flip'
      }`}
    >
      <svg className={isXL ? 'w-64 h-64' : isMd ? 'w-10 h-10' : 'w-8 h-8'}>
        <circle
          className='text-gray-300 dark:text-black'
          strokeWidth={strokeWidth}
          stroke='currentColor'
          fill='transparent'
          r={radius}
          cx={xy}
          cy={xy}
        />
        <linearGradient id={id}>
          {color === 'primary' ? (
            <>
              <stop offset='0%' stopColor='#5E41D5' />
              <stop offset='100%' stopColor='#D541B8' />
            </>
          ) : (
            <>
              <stop offset='0%' stopColor='#1E90FF' />
              <stop offset='100%' stopColor='#5E41D5' />
            </>
          )}
        </linearGradient>
        <circle
          className='text-gradient1'
          strokeWidth={outerStroke}
          strokeLinecap='butt'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke={`url(#${id})`}
          fill='transparent'
          r={radius}
          cx={xy}
          cy={xy}
        />
      </svg>
    </div>
  )
}

export default ProgressCircle
