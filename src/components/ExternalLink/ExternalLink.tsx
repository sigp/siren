import Link, { LinkProps } from 'next/link'
import { FC } from 'react'
import Typography, { TypographyProps } from '../Typography/Typography'

export interface ExternalLinkProps
  extends Omit<LinkProps, 'as' | 'href'>,
    Omit<TypographyProps, 'children' | 'as'> {
  text: string
  href: string | null
}

const ExternalLink: FC<ExternalLinkProps> = ({
  href,
  text,
  color = 'text-dark400',
  type = 'text-caption1',
  ...props
}) => {
  return (
    <div>
      {href ? (
        <Link href={href} target='_blank' passHref>
          <div className='flex space-x-2 items-center'>
            <Typography color={color} type={type} className='underline' {...props}>
              {text}
            </Typography>
            <i className='text-dark400 text-caption1 bi-box-arrow-up-right' />
          </div>
        </Link>
      ) : (
        <Typography color={color} type={type} className='underline' {...props}>
          {text}
        </Typography>
      )}
    </div>
  )
}

export default ExternalLink
