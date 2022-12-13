import { Endpoint } from '../types'
import { useCallback, useEffect, useState } from 'react'
import { debounce } from '../utilities/debounce'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ApiType } from '../constants/enums'
import { useTranslation } from 'react-i18next'

const useApiValidation = (path: string, type: ApiType, data?: Endpoint) => {
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
        if (code === 'ERR_NETWORK') {
          toast.error(t('error.cors', { type }), {
            position: 'top-right',
            autoClose: 5000,
            theme: 'colored',
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
          })
        }
        setValidApi(false)
      }
    }),
    [data, path, type],
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
