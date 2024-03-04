import fetchFromApi from '../../utilities/fetchFromApi';

const validatorUrl = process.env.VALIDATOR_URL;
const beaconUrl = process.env.BEACON_URL;

export const fetchBeaconNodeVersion = async () => await fetchFromApi(`${beaconUrl}/eth/v1/node/version`)
export const fetchValidatorAuthKey = async () => await fetchFromApi(`${validatorUrl}/lighthouse/auth`)
