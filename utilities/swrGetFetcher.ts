import axios from 'axios'

const swrGetFetcher = ([url]: [string, string]) => axios.get(url).then((res) => res.data)

export default swrGetFetcher
