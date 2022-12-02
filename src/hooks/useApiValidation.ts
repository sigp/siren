import { Endpoint } from '../types'
import { useCallback, useEffect, useState } from 'react'
import { debounce } from '../utilities/debounce'
import axios from 'axios'

const useApiValidation = (path: string, data?: Endpoint) => {
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
      } catch (e) {
        setValidApi(false)
      }
    }),
    [data, path],
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
