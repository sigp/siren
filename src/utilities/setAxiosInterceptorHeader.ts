import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'

const setAxiosInterceptorHeader = (header: AxiosRequestHeaders) => {
  axios.interceptors.request.use(function (config: AxiosRequestConfig) {
    if (!config) {
      config = {}
    }
    if (!config.headers) {
      config.headers = {}
    }
    config.headers = {
      ...config.headers,
      ...header,
    }
    return config
  })
}

export default setAxiosInterceptorHeader
