import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImportView } from '../../../constants/enums'
import CreateKeystoreView from './views/CreateKeystoreView/CreateKeystoreView'
import SelectImportTypeView from './views/SelectImportTypeView'
import UploadKeystoreView from './views/UploadKeystoreView'

const ImportValidatorView = () => {
  const { t } = useTranslation()
  const [view, setView] = useState<ImportView>(ImportView.SELECT)

  const moveToView = (nextView: ImportView) => setView(nextView)

  if (view === ImportView.CREATE) {
    return <CreateKeystoreView />
  }

  if (view === ImportView.UPLOAD) {
    return <UploadKeystoreView />
  }

  return <SelectImportTypeView onChangeView={moveToView} />
}

export default ImportValidatorView
