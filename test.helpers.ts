// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

export * from '@testing-library/react'

const hasChildren = (node: any) => node && (node.children || (node.props && node.props.children))

const getChildren = (node: any) =>
  node && node.children ? node.children : node.props && node.props.children

export const renderNodes = (reactNodes: any) => {
  if (typeof reactNodes === 'string') {
    return reactNodes
  }

  return Object.keys(reactNodes).map((key, i) => {
    const child = reactNodes[key]
    const isElement = React.isValidElement(child)

    if (typeof child === 'string') {
      return child
    }
    if (hasChildren(child)) {
      const inner = renderNodes(getChildren(child)) as any
      return React.cloneElement(child, { ...child.props, key: i }, inner)
    }
    if (typeof child === 'object' && !isElement) {
      return Object.keys(child).reduce((str, childKey) => child[childKey], '')
    }
    return child
  })
}

export const timezoneMock = function (locale: string, zone: string) {
  const DateTimeFormat = Intl.DateTimeFormat
  jest
    .spyOn(global.Intl, 'DateTimeFormat')
    .mockImplementation((l, options) => new DateTimeFormat(locale, { ...options, timeZone: zone }))
}

export const mockResponse = {
  status: 200,
  statusText: '',
  headers: {},
  config: {},
  data: [],
}

export const mockedRecoilValue = useRecoilValue as jest.MockedFn<typeof useRecoilValue>
export const mockedRecoilState = useRecoilState as jest.MockedFn<typeof useRecoilState>
export const mockedSetRecoilState = useSetRecoilState as jest.MockedFn<typeof useSetRecoilState>
