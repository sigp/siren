import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { debounce } from '../../utilities/debounce'
import displayToast from '../../utilities/displayToast'
import formatEndpoint from '../../utilities/formatEndpoint'
import { ApiType } from '../constants/enums'
import { Endpoint, ToastType } from '../types'

const useApiValidation = (
  path: string,
  type: ApiType,
  isToastAlert: boolean,
  data?: Endpoint | undefined,
) => {
  const { t } = useTranslation()
  const [isValid, setValidApi] = useState<boolean>(false)

  const testApi = useCallback(
    debounce(1000, async () => {
      if (!data) return

      const formattedAddress = formatEndpoint(data)

      try {
        const { status } = await axios.get(`${formattedAddress}/${path}`)
        if (status === 200) {
          setValidApi(true)
        }
      } catch (error) {
        if (!axios.isAxiosError(error)) return

        setValidApi(false)

        if (!isToastAlert) return

        if (error?.code === 'ERR_NETWORK') {
          displayToast(t('error.networkError', { type }), ToastType.ERROR)
        } else {
          displayToast(t('error.unknownError', { type }), ToastType.ERROR)
        }
      }
    }),
    [data, path, type, isToastAlert],
  )

  useEffect(() => {
    if (!data) return

    const isComplete = Object.values(data).every((value) => !!value)

    if (!isComplete) {
      setValidApi(false)
      return
    }

    void testApi()
  }, [data?.address, data?.port, data?.protocol])

  return isValid
}

export default useApiValidation
