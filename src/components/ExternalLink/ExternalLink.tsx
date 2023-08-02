import { FC, AnchorHTMLAttributes } from 'react'

export type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>

const ExternalLink: FC<ExternalLinkProps> = ({ children, ...props }) => {
  return (
    <a target='_blank' rel='noreferrer' {...props}>
      {children}
    </a>
  )
}

export default ExternalLink
