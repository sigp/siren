'use client'

import React, { FC } from 'react'
import Content from './Content'
import { MainProps } from './Main'

const Wrapper: FC<MainProps> = (props) => {
  return <Content {...props} />
}

export default Wrapper
