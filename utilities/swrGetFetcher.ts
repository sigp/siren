import axios from 'axios'

const swrGetFetcher = ([url]: [string, string]) => {
  return axios.get(url, {
    timeout: 10000, // 10 second timeout
  }).then((res) => res.data)
}

export default swrGetFetcher
