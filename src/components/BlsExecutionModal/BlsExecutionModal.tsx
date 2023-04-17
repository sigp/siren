import RodalModal from '../RodalModal/RodalModal'
import { useRecoilState } from 'recoil'
import { isBlsExecutionModal } from '../../recoil/atoms'
import useMediaQuery from '../../hooks/useMediaQuery'
import Typography from '../Typography/Typography'
import CodeInput from '../CodeInput/CodeInput'
import ValidatorDisclosure from '../Disclosures/ValidatorDisclosure'
import { useState } from 'react'
import { MOCK_BLS_JSON, WithdrawalInfoLink } from '../../constants/constants'
import GradientHeader from '../GradientHeader/GradientHeader'
import { ButtonFace } from '../Button/Button'
import { useTranslation, Trans } from 'react-i18next'

const BlsExecutionModal = () => {
  const { t } = useTranslation()
  const [isModal, toggleModal] = useRecoilState(isBlsExecutionModal)
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const [blsJson, setJson] = useState(MOCK_BLS_JSON)

  const closeModal = () => toggleModal(false)
  const setJsonValue = (value: string) => setJson(value)

  const showWarning = () => {
    console.log('make execution... ')
  }

  return (
    <RodalModal
      isVisible={isModal}
      styles={{
        width: 'fit-content',
        maxWidth: isTablet ? '448px' : '900px',
        height: isTablet ? '540px' : 'max-content',
      }}
      onClose={closeModal}
    >
      <div>
        <GradientHeader title={t('blsExecution.modal.title')} />
        <div className='p-6 space-y-4'>
          <Typography type='text-caption1'>
            <Trans i18nKey='blsExecution.modal.subTitle'>
              <br />
            </Trans>
            {' ---'}
          </Typography>
          <Typography className='w-3/4' type='text-caption1'>
            {t('blsExecution.modal.description')}
          </Typography>
          <Typography className='w-3/4' type='text-caption1'>
            <Trans i18nKey='blsExecution.modal.followLink'>
              <a
                className='text-blue-500 underline'
                target='_blank'
                rel='noreferrer'
                href={WithdrawalInfoLink}
              />
            </Trans>
          </Typography>
          <CodeInput value={blsJson} onChange={setJsonValue} />
        </div>
        {isModal && (
          <div className='p-3 border-t-style100'>
            <ValidatorDisclosure
              isSensitive
              onAccept={showWarning}
              ctaType={ButtonFace.SECONDARY}
              ctaText={t('blsExecution.modal.cta')}
            />
          </div>
        )}
      </div>
    </RodalModal>
  )
}

export default BlsExecutionModal
