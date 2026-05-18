import { Cache } from 'cache-manager';
import {
  getNetworkProfile,
  NetworkProfile,
} from '../../../utilities/getNetworkProfile';

export async function getCachedNetworkProfile(
  cacheManager: Cache,
): Promise<NetworkProfile> {
  const spec = await cacheManager.get<{ CONFIG_NAME?: string }>('specs');
  return getNetworkProfile(spec?.CONFIG_NAME);
}
