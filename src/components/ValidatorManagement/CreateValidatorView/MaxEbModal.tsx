import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'
import { useRecoilState } from 'recoil'
import { isMaxEBModal } from '../../../recoil/atoms'
import Button, { ButtonFace } from '../../Button/Button'
import RodalModal from '../../RodalModal/RodalModal'
import Typography from '../../Typography/Typography'

const MaxEbModal = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useRecoilState(isMaxEBModal)
  const onClose = () => {
    setIsOpen(false)
    Cookies.set('max-eB-warning-seen', 'true')
  }

  return (
    <RodalModal onClose={onClose} styles={{ maxWidth: '650px' }} isVisible={isOpen}>
      <div className='w-full flex flex-col p-6 space-y-6 items-center justify-center'>
        <i className='bi-exclamation-circle text-6xl text-warning' />
        <Typography type='text-caption1' className='text-center'>
          {t('validatorManagement.maxEBModal.text')}
        </Typography>
        <Button onClick={onClose} type={ButtonFace.TERTIARY}>
          {t('understandAndAccept')}
        </Button>
      </div>
    </RodalModal>
  )
}

export default MaxEbModal
