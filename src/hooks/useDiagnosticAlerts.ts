import useDeviceDiagnostics from './useDeviceDiagnostics';
import { useRecoilValue } from 'recoil';
import { validatorPeerCount } from '../recoil/atoms';
import { useMemo } from 'react';
import { Alert } from '../types';

const useDiagnosticAlerts = () => {
  const {
    natOpen
  } = useDeviceDiagnostics()
  const peers = useRecoilValue(validatorPeerCount)

  const natAlert = useMemo<Alert | undefined>(() => {
    if(natOpen) return

    return {
      message: 'Network: NAT status is closed.',
      subText: 'Poor',
      severity: 'bg-error'
    }
  }, [natOpen])

  const peerCountAlert = useMemo<Alert | undefined>(() => {
    if(!peers) return undefined;

    switch (true) {
      case peers < 20:
        return {
          message: 'Node / Validator: Peer count extremely low',
          subText: 'Poor',
          severity: 'bg-error'
        }
      case peers > 20 && peers < 50:
        return {
          message: 'Node / Validator: Peer count reaching low levels',
          subText: 'Fair',
          severity: 'bg-warning'
      }
      default:
        return undefined
    }
  }, [peers])


  return {
    natAlert,
    peerCountAlert
  }
}

export default useDiagnosticAlerts;