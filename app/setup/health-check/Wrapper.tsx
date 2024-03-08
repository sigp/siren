'use client'

import React, { FC } from 'react';
import Main, { MainProps } from './Main';
import Providers from '../../Providers';
import '../../../src/i18n'

const Wrapper:FC<MainProps> = (props) => {
  return (
    <Providers>
      <Main {...props}/>
    </Providers>
  )
}

export default Wrapper