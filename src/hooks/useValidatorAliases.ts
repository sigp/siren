import axios from 'axios'
import { useCallback } from 'react'
import useSWR, { mutate } from 'swr'
import { ValAliases } from '../types'

const API_URL = '/api/validator'

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

interface UseValidatorAliasesReturn {
  aliases: ValAliases | undefined
  isLoading: boolean
  error: any
  updateAlias: (validatorIndex: number, alias: string) => Promise<void>
  deleteAlias: (validatorIndex: number) => Promise<void>
  importAliases: (aliases: ValAliases) => Promise<void>
  mutateAliases: () => Promise<void>
}

export function useValidatorAliases(): UseValidatorAliasesReturn {
  const {
    data: aliases,
    error,
    isLoading,
  } = useSWR<ValAliases>(`${API_URL}/aliases`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  const updateAlias = useCallback(async (validatorIndex: number, alias: string) => {
    try {
      await axios.put(`${API_URL}/aliases/${validatorIndex}`, { alias })
      await mutate(`${API_URL}/aliases`)
    } catch (error) {
      console.error('Failed to update validator alias:', error)
      throw error
    }
  }, [])

  const deleteAlias = useCallback(async (validatorIndex: number) => {
    try {
      await axios.delete(`${API_URL}/aliases/${validatorIndex}`)
      await mutate(`${API_URL}/aliases`)
    } catch (error) {
      console.error('Failed to delete validator alias:', error)
      throw error
    }
  }, [])

  const importAliases = useCallback(async (aliases: ValAliases) => {
    try {
      await axios.post(`${API_URL}/aliases/import`, { aliases })
      await mutate(`${API_URL}/aliases`)
    } catch (error) {
      console.error('Failed to import validator aliases:', error)
      throw error
    }
  }, [])

  const mutateAliases = useCallback(async () => {
    await mutate(`${API_URL}/aliases`)
  }, [])

  return {
    aliases,
    isLoading,
    error,
    updateAlias,
    deleteAlias,
    importAliases,
    mutateAliases,
  }
}
