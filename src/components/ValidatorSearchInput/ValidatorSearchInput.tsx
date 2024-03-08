import { useTranslation } from 'react-i18next'
import { useRecoilState } from 'recoil'
import useUiMode from '../../hooks/useUiMode'
import { validatorSearch } from '../../recoil/atoms'
import Input from '../Input/Input'

const ValidatorSearchInput = () => {
  const { t } = useTranslation()
  const { mode } = useUiMode()
  const [search, setSearch] = useRecoilState(validatorSearch)

  return (
    <Input
      uiMode={mode}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      inputStyle='secondary'
      icon='bi-search'
      placeholder={t('search')}
    />
  )
}

export default ValidatorSearchInput
