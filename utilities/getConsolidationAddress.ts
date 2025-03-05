import {CONSOLIDATION_CONTRACT, MEKONG_CHAINID, MEKONG_CONSOLIDATION_CONTRACT} from "../src/constants/constants";

const getConsolidationAddress = (chainId: number) => {
  return chainId === MEKONG_CHAINID ? MEKONG_CONSOLIDATION_CONTRACT : CONSOLIDATION_CONTRACT
}

export default getConsolidationAddress