import axios from 'axios'

const swrGetFetcher = (url: string) => {
  return axios.get(url, {
    timeout: 10000,
    withCredentials: true,
  }).then((res) => {
    if (res.status !== 200) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }
    return res.data
  }).catch((error) => {
    throw error
  })
}

export default swrGetFetcher
