'use client'

import React, { Suspense } from 'react'
import Main from './Main'
import Providers from './Providers'
import '../src/i18n'

const Wrapper = () => {
  return (
    <Suspense>
      <Providers>
        <Main />
      </Providers>
    </Suspense>
  )
}

export default Wrapper
