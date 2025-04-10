import { FC } from 'react'
import Typography, { TypographyProps } from '../Typography/Typography'

export interface WordCountDisplayProps extends Pick<TypographyProps, 'color'> {
  count: number
  limit: number
}

const WordCountDisplay: FC<WordCountDisplayProps> = ({ count, limit, color }) => {
  return (
    <div className='w-full flex justify-end'>
      <Typography
        color={color}
        darkMode={color ? `dark:${color}` : undefined}
        type='text-caption1.5'
      >
        {count} / {limit}
      </Typography>
    </div>
  )
}

export default WordCountDisplay
