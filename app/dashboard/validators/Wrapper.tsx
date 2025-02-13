'use client'

import React, { FC, Suspense } from 'react'
import Providers from '../../Providers'
import Main, { MainProps } from './Main'
import '../../../src/i18n'

const Wrapper: FC<MainProps> = (props) => {
  return (
    <Suspense>
      <Providers>
        <Main {...props} />
      </Providers>
    </Suspense>
  )
}

export default Wrapper
