import { Endpoint } from '../types'
import { useCallback, useEffect, useState } from 'react'
import { debounce } from '../utilities/debounce'
import axios from 'axios'
import { toast, ToastOptions } from 'react-toastify'
import { ApiType } from '../constants/enums'
import { useTranslation } from 'react-i18next'

const useApiValidation = (path: string, type: ApiType, isToastAlert: boolean, data?: Endpoint) => {
  const { t } = useTranslation()
  const [isValid, setValidApi] = useState<boolean>(false)

  const testApi = useCallback(
    debounce(1000, async () => {
      if (!data) return

      const { port, protocol, address } = data
      try {
        const { status } = await axios.get(`${protocol}://${address}:${port}/${path}`)
        if (status === 200) {
          setValidApi(true)
        }
      } catch ({ code }) {
        setValidApi(false)

        if (!isToastAlert) return

        const options = {
          position: 'top-right',
          autoClose: 5000,
          theme: 'colored',
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
        } as ToastOptions

        if (code === 'ERR_NETWORK') {
          toast.error(t('error.networkError', { type }), options)
        } else {
          toast.error(t('error.unknownError', { type }), options)
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
