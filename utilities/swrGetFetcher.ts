import axios from 'axios'

const swrGetFetcher = (url: string) => {
  // Only send credentials for same-origin or relative URLs
  // External APIs like Coinbase don't support credentials with wildcard CORS
  const isExternal = url.startsWith('http://') || url.startsWith('https://')
  const withCredentials = !isExternal

  return axios
    .get(url, {
      timeout: 5000, // Reduced from 10s to 5s for faster failure detection
      withCredentials,
    })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`HTTP error! Status: ${res.status}`)
      }
      return res.data
    })
    .catch((error) => {
      throw error
    })
}

export default swrGetFetcher
