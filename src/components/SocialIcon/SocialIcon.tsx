import { FC } from 'react'
import Typography, { TypographyColor } from '../Typography/Typography'

interface SocialIconProps {
  title: string
  icon: string
  darkMode?: string
  color?: TypographyColor
  href: string
}

const SocialIcon: FC<SocialIconProps> = ({
  title,
  icon,
  href,
  darkMode,
  color = 'text-dark900',
}) => {
  return (
    <div className='space-y-3'>
      <Typography
        isBold
        className='uppercase'
        darkMode={darkMode}
        type='text-caption2'
        color={color}
      >
        {title}
      </Typography>
      <div>
        <a target='_blank' rel='noreferrer' href={href}>
          <i className={`text-subtitle2 ${icon} ${color}`} />
        </a>
      </div>
    </div>
  )
}

export default SocialIcon
