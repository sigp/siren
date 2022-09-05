import {FC, useMemo} from "react";

export interface ProgressCircleProps {
    percent?: number
    color?: 'primary' | 'secondary',
    direction?: 'clock' | 'counter'
}

const ProgressCircle:FC<ProgressCircleProps> = ({percent = 0, color = 'primary', direction = 'clock'}) => {
    const radius = 20;
    const circumference = radius * 2 * Math.PI;
    const formattedPercentage = percent < 0 ? 0 : percent > 100 ? 100 : percent
    const offset = circumference - formattedPercentage / 100 * circumference;
    const strokeWidth = 10;
    

  return (
      <div
          className={`inline-flex items-center justify-center overflow-hidden rounded-full ${direction === 'clock' ? 'rotate-90' : 'flip'}`}
      >
          <svg className="w-10 h-10">
              <circle
                  className="text-gray-300"
                  strokeWidth={strokeWidth}
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="20"
                  cy="20"
              />
              <linearGradient id="gradient">
                  {color === 'primary' ? (
                      <>
                          <stop offset="0%"  stopColor="#5E41D5"/>
                          <stop offset="100%" stopColor="#D541B8"/>
                      </>
                  ) : (
                      <>
                          <stop offset="0%"  stopColor="#1E90FF"/>
                          <stop offset="100%" stopColor="#5E41D5"/>
                      </>
                  )}
              </linearGradient>
              <circle
                  className="text-gradient1"
                  strokeWidth={strokeWidth + 4}
              strokeLinecap="butt"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              stroke="url(#gradient)"
              fill="transparent"
              r={radius}
              cx="20"
              cy="20"
              />
          </svg>
      </div>
  )
}

export default ProgressCircle;