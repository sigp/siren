'use client'

import React, { FC } from 'react'
import Main, { MainProps } from './Main'

const Wrapper: FC<MainProps> = (props) => {
  return <Main {...props} />
}

export default Wrapper
