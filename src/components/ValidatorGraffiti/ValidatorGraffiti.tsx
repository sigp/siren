import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import displayToast from '../../../utilities/displayToast'
import useUiMode from '../../hooks/useUiMode'
import { ToastType } from '../../types'
import { ValidatorInfo } from '../../types/validator'
import AuthPrompt from '../AuthPrompt/AuthPrompt'
import ValidatorGraffitiInput from '../ValidatorGraffitiInput/ValidatorGraffitiInput'

export interface ValidatorGraffitiProps {
  validator: ValidatorInfo
}

const ValidatorGraffiti: FC<ValidatorGraffitiProps> = ({ validator }) => {
  const { t } = useTranslation()
  const { index, pubKey } = validator
  const { mode } = useUiMode()

  const [isAuth, setAuth] = useState(false)
  const [graffitiInput, setGraffitiInput] = useState('')
  const [graffiti, setGraffiti] = useState<string | undefined>()
  const [isLoading, setLoading] = useState(false)

  const storeGraffitiInput = (value: string) => {
    setGraffitiInput(value)
    setAuth(true)
  }

  const fetchGraffiti = async () => {
    try {
      const { data } = await axios.get(`/api/validator-graffiti/${index}`)

      if (data) {
        setGraffiti(data.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const updateGraffiti = async (password: string) => {
    setLoading(true)
    setAuth(false)

    try {
      const { status } = await axios.put('/api/update-graffiti', {
        graffiti: graffitiInput,
        pubKey,
        password,
      })

      setLoading(false)

      if (status === 200) {
        setGraffiti(graffitiInput)
        displayToast(t('validatorEdit.graffiti.successUpdate'), ToastType.SUCCESS)
      } else {
        displayToast(t('validatorEdit.graffiti.unexpectedError'), ToastType.ERROR)
      }
    } catch (e) {
      setLoading(false)
      displayToast(t('validatorEdit.graffiti.errorUpdate'), ToastType.ERROR)
    }
  }

  const closeAuth = () => setAuth(false)

  useEffect(() => {
    void fetchGraffiti()
  }, [])

  return (
    <>
      <AuthPrompt
        isLoading={isLoading}
        mode={mode}
        onClose={closeAuth}
        isVisible={isAuth}
        onSubmit={updateGraffiti}
      />
      <ValidatorGraffitiInput
        isLoading={isLoading}
        onSubmit={storeGraffitiInput}
        value={graffiti}
      />
    </>
  )
}

export default ValidatorGraffiti
