import Input from '../Input/Input';
import useUiMode from '../../hooks/useUiMode';
import { useRecoilState } from 'recoil';
import { validatorSearch } from '../../recoil/atoms';

const ValidatorSearchInput = () => {
  const {mode} = useUiMode()
  const [search, setSearch] = useRecoilState(validatorSearch)

  return (
    <Input uiMode={mode} value={search} onChange={(e) => setSearch(e.target.value)} inputStyle="secondary" icon="bi-search" placeholder="Search..."/>
  )
}

export default ValidatorSearchInput;