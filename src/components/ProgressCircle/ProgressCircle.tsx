import { FC } from 'react'

export type ProgressColor = 'primary' | 'secondary'
export type ProgressDirection = 'clock' | 'counter'

export interface ProgressCircleProps {
  percent?: number
  color?: ProgressColor
  direction?: ProgressDirection
  size?: 'sm' | 'md'
  id: string
}

const ProgressCircle: FC<ProgressCircleProps> = ({
  percent = 0,
  id,
  color = 'primary',
  direction = 'clock',
  size = 'md'
}) => {
  const isSmall = size === 'sm';
  const radius = isSmall ? 18 : 20;
  const circumference = radius * 2 * Math.PI
  const formattedPercentage = percent < 0 ? 0 : percent > 100 ? 100 : percent
  const offset = circumference - (formattedPercentage / 100) * circumference
  const strokeWidth = 10
  const xy = isSmall ? 16 : 20;

  return (
    <div
      className={`inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full ${
        direction === 'clock' ? 'rotate-90' : 'flip'
      }`}
    >
      <svg className={isSmall ? 'w-8 h-8' : 'w-10 h-10'}>
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
          strokeWidth={strokeWidth + 4}
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
