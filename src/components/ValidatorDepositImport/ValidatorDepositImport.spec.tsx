import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { Status } from '../../constants/enums'
import useImportValidator from '../../hooks/useImportValidator'
import useResolveTransactionOnce from '../../hooks/useResolveTransactionOnce'
import { NetworkId } from '../../types'
import ValidatorDepositImport from './ValidatorDepositImport'

// ----- MOCKS for utilities that the component now uses -----

// Prevent real network calls during postActivity
jest.mock('../../../utilities/postActivity', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// keep existing mocks for the two hooks
jest.mock('../../hooks/useResolveTransactionOnce', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('../../hooks/useImportValidator', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// i18n mock remains the same
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

// formatEthAddress mock remains the same
jest.mock('../../../utilities/formatEthAddress', () => ({
  __esModule: true,
  default: (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`,
}))

// getBeaconChaLink mock remains the same
jest.mock('../../../utilities/getBeaconChaLink', () => ({
  __esModule: true,
  default: (networkId: any, path: string) => `http://beaconcha.in${path}`,
}))

describe('ValidatorDepositImport', () => {
  const depositData = {
    txHash: '0x123' as `0x${string}`,
    pubKey: '0x456789abcdef123456789abcdef123456789abcdef' as `0x${string}`,
    mnemonicIndex: 0,
    amount: BigInt(32),
    suggestedFeeRecipient: '0xsuggestedFeeRecipient',
    keyStorePassword: 'password',
    status: Status.PENDING,
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
      txStatus: Status.PENDING,
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
      txStatus: Status.SUCCESS,
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
      txStatus: Status.SUCCESS,
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
      txStatus: Status.SUCCESS,
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
      txStatus: Status.ERROR,
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

  it('immediately calls onUpdateStatus(pubKey, Status.ERROR) when txStatus is ERROR', async () => {
    ;(useResolveTransactionOnce as jest.Mock).mockReturnValue({
      txStatus: Status.ERROR,
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

    // Wait for the useEffect to run and call onUpdateStatus
    await waitFor(() => {
      expect(onUpdateStatus).toHaveBeenCalledWith(depositData.pubKey, Status.ERROR)
    })
  })

  it('calls importValidator and triggers onUpdateStatus callback when txStatus is SUCCESS and no import flags set', async () => {
    const importValidatorMock = jest.fn().mockImplementation(async ({ onSuccess }) => {
      if (onSuccess) {
        onSuccess()
      }
    })

    ;(useResolveTransactionOnce as jest.Mock).mockReturnValue({
      txStatus: Status.SUCCESS,
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
        suggestedFeeRecipient: '0xsuggestedFeeRecipient',
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    })

    expect(onUpdateStatus).toHaveBeenCalledWith(depositData.pubKey, Status.SUCCESS)
  })

  it('renders immediate success UI when depositData.status is already SUCCESS', () => {
    const alreadyComplete = {
      ...depositData,
      status: Status.SUCCESS,
    }

    // Even if txStatus is still pending, status === SUCCESS should shortcut to “validatorComplete”
    ;(useResolveTransactionOnce as jest.Mock).mockReturnValue({
      txStatus: Status.PENDING,
    })
    ;(useImportValidator as jest.Mock).mockReturnValue({
      isError: false,
      isLoading: false,
      isSuccess: false,
      importValidator: jest.fn(),
    })

    render(
      <ValidatorDepositImport
        depositData={alreadyComplete}
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
})
