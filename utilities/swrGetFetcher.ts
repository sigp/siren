import axios from 'axios'

const swrGetFetcher = (url: string) => {
  return axios.get(url, {
    timeout: 5000, // Reduced from 10s to 5s for faster failure detection
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
