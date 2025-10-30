'use client'

import React, { FC, Suspense } from 'react'
import Main, { MainProps } from './Main'

const Wrapper: FC<MainProps> = (props) => {
  return (
    <Suspense>
      <Main {...props} />
    </Suspense>
  )
}

export default Wrapper
