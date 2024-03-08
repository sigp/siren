import axios from 'axios';

const swrGetFetcher = url => axios.get(url).then(res => res.data);

export default swrGetFetcher