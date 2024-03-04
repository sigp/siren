'use client'

import React, { FC } from 'react';
import Main, { InitProps } from './Main';
import Providers from './Providers';
import '../src/i18n'

const Wrapper:FC<InitProps> = (props) => {
  return (
    <Providers>
      <Main {...props}/>
    </Providers>
  )
}

export default Wrapper