declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGElement>>
  export default content
}

declare module '*.svg?url' {
  const content: any
  export default content
}

declare module '*.png'

declare module 'rodal'

declare module 'svg-identicon'

declare module 'crypto-js'

declare module 'i18next'

declare module '@testing-library/react'

declare module '@leodeslf/perlin-noise'
