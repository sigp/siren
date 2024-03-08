import fetchFromApi from '../../utilities/fetchFromApi';

const beaconUrl = process.env.BEACON_URL;

export const fetchBeaconHealth = async () => await fetchFromApi(`${beaconUrl}/lighthouse/ui/health`, {next: {revalidate: 6}})
export const fetchBeaconSync = async () => await fetchFromApi(`${beaconUrl}/eth/v1/node/syncing`, {next: {revalidate: 12}})
export const fetchExecutionSync = async () => await fetchFromApi(`${beaconUrl}/lighthouse/eth1/syncing`, {next: {revalidate: 12}})