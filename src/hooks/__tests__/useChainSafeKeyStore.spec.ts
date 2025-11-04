import { create, IKeystore } from '@chainsafe/bls-keystore'
import { renderHook, act } from '@testing-library/react'
import { useRecoilValue } from 'recoil'
import { blsModuleAtom } from '../../recoil/atoms'
import useChainSafeKeygen from '../useChainSafeKeygen'
import useChainSafeKeyStore, { KeyStoreData } from '../useChainSafeKeyStore'

jest.mock('@chainsafe/bls-keystore', () => ({
  create: jest.fn(),
}))
jest.mock('recoil', () => ({
  useRecoilValue: jest.fn(),
}))
jest.mock('../useChainSafeKeygen')

const mockCreate = create as jest.MockedFunction<typeof create>
const mockUseRecoilValue = useRecoilValue as jest.MockedFunction<typeof useRecoilValue>
const mockUseChainSafeKeygen = useChainSafeKeygen as jest.Mock

describe('useChainSafeKeyStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('generates a keystore and returns KeyStoreData', async () => {
    // Mock recoil to return a dummy module
    mockUseRecoilValue.mockReturnValue({})

    // Mock key derivation functions
    const eipKey = 'derived-eip-key'
    const secretBytes = new Uint8Array([1, 2, 3])
    const publicBytes = new Uint8Array([4, 5, 6])
    const mockDeriveEIP = jest.fn().mockReturnValue(eipKey)
    const mockDeriveValidator = jest.fn().mockReturnValue({
      secretKey: { toBytes: () => secretBytes },
      publicKey: { toBytes: () => publicBytes },
    })
    mockUseChainSafeKeygen.mockReturnValue({
      deriveEIP2334SubKey: mockDeriveEIP,
      deriveValidatorSigningKey: mockDeriveValidator,
    })

    // Mock create() to resolve a dummy keystore with all required IKeystore fields
    const dummyKeystore: IKeystore = {
      version: 4,
      uuid: 'dummy-uuid',
      path: '',
      pubkey: Buffer.from(publicBytes).toString('hex'),
      crypto: {
        kdf: {} as any,
        checksum: {} as any,
        cipher: {} as any,
      },
    }
    mockCreate.mockResolvedValueOnce(dummyKeystore)

    const { result } = renderHook(() => useChainSafeKeyStore())

    let output: KeyStoreData | undefined
    await act(async () => {
      output = await result.current.generateKeystore(
        'test-mnemonic',
        1,
        'test-password',
        '0xFeeRecipient',
      )
    })

    // Assertions
    expect(mockUseRecoilValue).toHaveBeenCalledWith(blsModuleAtom)
    expect(mockDeriveEIP).toHaveBeenCalledWith('test-mnemonic')
    expect(mockDeriveValidator).toHaveBeenCalledWith(eipKey, 1)
    expect(mockCreate).toHaveBeenCalledWith(
      'test-password',
      secretBytes,
      publicBytes,
      `m/12381/3600/1/0/0`,
    )
    expect(output).toEqual({
      enable: true,
      password: 'test-password',
      keystore: dummyKeystore,
      suggested_fee_recipient: '0xFeeRecipient',
    })
  })

  it('throws an error if create() fails', async () => {
    mockUseRecoilValue.mockReturnValue({})
    mockUseChainSafeKeygen.mockReturnValue({
      deriveEIP2334SubKey: () => 'eip',
      deriveValidatorSigningKey: () => ({
        secretKey: { toBytes: () => new Uint8Array() },
        publicKey: { toBytes: () => new Uint8Array() },
      }),
    })
    const error = new Error('keystore failure')
    mockCreate.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useChainSafeKeyStore())

    await expect(result.current.generateKeystore('mnemonic', 0, 'pwd', 'fee')).rejects.toThrow(
      'keystore failure',
    )
  })
})
