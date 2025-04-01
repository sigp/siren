import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import useImportValidator from '../../hooks/useImportValidator'
import useResolveTransactionOnce from '../../hooks/useResolveTransactionOnce'
import { NetworkId, TxStatus } from '../../types'
import ValidatorDepositImport from './ValidatorDepositImport'

jest.mock('../../hooks/useResolveTransactionOnce', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('../../hooks/useImportValidator', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

jest.mock('../../../utilities/formatEthAddress', () => ({
  __esModule: true,
  default: (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`,
}))

jest.mock('../../../utilities/getBeaconChaLink', () => ({
  __esModule: true,
  default: (networkId: any, path: string) => `http://beaconcha.in${path}`,
}))

describe('ValidatorDepositImport', () => {
  const depositData = {
    txHash: '0x123' as `0x${string}`,
    pubKey: '0x456789abcdef123456789abcdef123456789abcdef' as `0x${string}`,
    mnemonicIndex: 0,
    keyStorePassword: 'password',
    status: 'pending' as TxStatus,
  }
  const mnemonic = 'sample mnemonic'
  const depositNetworkId = NetworkId.MAINNET

  const onRetryTx = jest.fn()
  const onUpdateStatus = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders pending state when txStatus is pending and no import status flags are set', () => {
    ;(useResolveTransactionOnce as jest.Mock).mockReturnValue({
      txStatus: 'pending',
    })
    ;(useImportValidator as jest.Mock).mockReturnValue({
      isError: false,
      isLoading: false,
      isSuccess: false,
      importValidator: jest.fn(),
    })

    render(
      <ValidatorDepositImport
        depositData={depositData}
        mnemonic={mnemonic}
        depositNetworkId={depositNetworkId}
        onRetryTx={onRetryTx}
        onUpdateStatus={onUpdateStatus}
      />,
    )

    expect(screen.getByText('validatorManagement.txStatuses.pending.title')).toBeInTheDocument()
    expect(screen.getByText('validatorManagement.txStatuses.pending.text')).toBeInTheDocument()
  })

  it('renders import pending state when useImportValidator is loading', () => {
    ;(useResolveTransactionOnce as jest.Mock).mockReturnValue({
      txStatus: 'success',
    })
    ;(useImportValidator as jest.Mock).mockReturnValue({
      isError: false,
      isLoading: true,
      isSuccess: false,
      importValidator: jest.fn(),
    })

    render(
      <ValidatorDepositImport
        depositData={depositData}
        mnemonic={mnemonic}
        depositNetworkId={depositNetworkId}
        onRetryTx={onRetryTx}
        onUpdateStatus={onUpdateStatus}
      />,
    )

    expect(
      screen.getByText('validatorManagement.txStatuses.importPending.title'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('validatorManagement.txStatuses.importPending.text'),
    ).toBeInTheDocument()
  })

  it('renders import error state when useImportValidator indicates an error', () => {
    ;(useResolveTransactionOnce as jest.Mock).mockReturnValue({
      txStatus: 'success',
    })
    ;(useImportValidator as jest.Mock).mockReturnValue({
      isError: true,
      isLoading: false,
      isSuccess: false,
      importValidator: jest.fn(),
    })

    render(
      <ValidatorDepositImport
        depositData={depositData}
        mnemonic={mnemonic}
        depositNetworkId={depositNetworkId}
        onRetryTx={onRetryTx}
        onUpdateStatus={onUpdateStatus}
      />,
    )

    expect(screen.getByText('validatorManagement.txStatuses.importError.title')).toBeInTheDocument()
    expect(screen.getByText('validatorManagement.txStatuses.importError.text')).toBeInTheDocument()
  })

  it('renders import success state when useImportValidator indicates success', () => {
    ;(useResolveTransactionOnce as jest.Mock).mockReturnValue({
      txStatus: 'success',
    })
    ;(useImportValidator as jest.Mock).mockReturnValue({
      isError: false,
      isLoading: false,
      isSuccess: true,
      importValidator: jest.fn(),
    })

    render(
      <ValidatorDepositImport
        depositData={depositData}
        mnemonic={mnemonic}
        depositNetworkId={depositNetworkId}
        onRetryTx={onRetryTx}
        onUpdateStatus={onUpdateStatus}
      />,
    )

    expect(
      screen.getByText('validatorManagement.txStatuses.validatorComplete.title'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('validatorManagement.txStatuses.validatorComplete.text'),
    ).toBeInTheDocument()
  })

  it('calls retryTransaction when txStatus is error and no import flag is set', () => {
    ;(useResolveTransactionOnce as jest.Mock).mockReturnValue({
      txStatus: 'error',
    })
    ;(useImportValidator as jest.Mock).mockReturnValue({
      isError: false,
      isLoading: false,
      isSuccess: false,
      importValidator: jest.fn(),
    })

    render(
      <ValidatorDepositImport
        depositData={depositData}
        mnemonic={mnemonic}
        depositNetworkId={depositNetworkId}
        onRetryTx={onRetryTx}
        onUpdateStatus={onUpdateStatus}
      />,
    )

    const retryEl = screen.getByText('validatorManagement.retryTransaction')
    expect(retryEl).toBeInTheDocument()

    fireEvent.click(retryEl)
    expect(onRetryTx).toHaveBeenCalledWith(depositData.txHash)
  })

  it('calls importValidator and triggers onUpdateStatus callback when txStatus is not pending or error', async () => {
    const importValidatorMock = jest.fn().mockImplementation(async ({ onSuccess }) => {
      if (onSuccess) {
        onSuccess()
      }
    })

    ;(useResolveTransactionOnce as jest.Mock).mockReturnValue({
      txStatus: 'success',
    })
    ;(useImportValidator as jest.Mock).mockReturnValue({
      isError: false,
      isLoading: false,
      isSuccess: false,
      importValidator: importValidatorMock,
    })

    render(
      <ValidatorDepositImport
        depositData={depositData}
        mnemonic={mnemonic}
        depositNetworkId={depositNetworkId}
        onRetryTx={onRetryTx}
        onUpdateStatus={onUpdateStatus}
      />,
    )

    await waitFor(() => {
      expect(importValidatorMock).toHaveBeenCalledWith({
        mnemonic,
        index: depositData.mnemonicIndex,
        keyStorePassword: depositData.keyStorePassword,
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    })

    expect(onUpdateStatus).toHaveBeenCalledWith(depositData.pubKey, 'success')
  })
})
