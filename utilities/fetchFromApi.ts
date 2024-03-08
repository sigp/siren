import { NextFetchRequestInit } from '../src/types';

const fetchFromApi = async (url: string, options: NextFetchRequestInit = {}) => {
  const defaultOptions: RequestInit = {
    method: 'GET',
  };

  const finalOptions: RequestInit = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      return ({error: `HTTP error! status: ${response.status}`})
    }

    return await response.json();
  } catch (e) {
    return ({error: `HTTP error! status: ${e}`})
  }
}

export default fetchFromApi