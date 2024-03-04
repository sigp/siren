import { NextFetchRequestInit } from '../../src/types';
import fetchFromApi from '../../utilities/fetchFromApi';

const validatorUrl = process.env.VALIDATOR_URL;
const beaconUrl = process.env.BEACON_URL;
const apiToken = process.env.API_TOKEN;

export const fetchVersion = async () => {
  const response = await fetch(`${validatorUrl}/lighthouse/version`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
    }
  } as NextFetchRequestInit);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export const fetchBeaconNodeVersion = async () => await fetchFromApi(`${beaconUrl}/eth/v1/node/version`)
export const fetchValidatorAuthKey = async () => await fetchFromApi(`${validatorUrl}/lighthouse/auth`)
