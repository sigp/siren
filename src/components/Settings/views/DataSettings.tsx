import axios from 'axios'
import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useValidatorExclusionList from '../../../hooks/useValidatorExclusionList'
import { ExcludedStatus } from '../../../types'
import { ValidatorStatus } from '../../../types/validator'
import CheckBox from '../../CheckBox/CheckBox'
import SettingsHeader from '../SettingsHeader'
import SimpleSection from '../SimpleSection'

export interface DataSettingsProps {
  initExclusions: ExcludedStatus[]
}

const DataSettings: FC<DataSettingsProps> = ({ initExclusions }) => {
  const { t } = useTranslation()
  const [isUpdating, setIsUpdating] = useState(false)
  const { exclusions, formattedExclusions, setExclusions } =
    useValidatorExclusionList(initExclusions)

  const validatorStatuses = [
    'pending_initialized',
    'pending_queued',
    'active_ongoing',
    'active_exiting',
    'active_slashed',
    'exited_unslashed',
    'exited_slashed',
    'withdrawal_possible',
    'withdrawal_done',
    'active',
    'pending',
    'exited',
    'withdrawal',
    'deposit',
  ] as ValidatorStatus[]

  const deleteExclusion = async (id: number) => {
    try {
      setIsUpdating(true)
      const { data } = await axios.delete(`/api/remove-exclusion/${id}`)
      setExclusions(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsUpdating(false)
    }
  }

  const addExclusion = async (status: ValidatorStatus) => {
    try {
      setIsUpdating(true)
      const { data } = await axios.post('/api/add-exclusion', { status })
      setExclusions(data)
    } catch (e) {
    } finally {
      setIsUpdating(false)
    }
  }

  const submitExclusion = async (selectedStatus: ValidatorStatus) => {
    const excludedStatus = exclusions.find(({ status }) => status === selectedStatus)

    if (excludedStatus) {
      await deleteExclusion(excludedStatus.id)
      return
    }

    void (await addExclusion(selectedStatus))
  }

  return (
    <div className='flex-1 py-4 px-6 md:py-6 md:px-16 w-full max-w-[1540px]'>
      <SettingsHeader sections={[t('settings'), t('dataManagement')]} />
      <div className='w-full relative pt-6 @1600:max-w-4xl space-y-16 lg:mt-0 px-0'>
        <SimpleSection
          style='vertical'
          title={t('validatorDisplay.title')}
          text={t('validatorDisplay.helperText')}
        >
          <div className='flex pt-8 order-1 w-full flex-wrap max-w-[600px] md:order-2 mb-8 md:mb-0 items-center'>
            {validatorStatuses.map((status, index) => (
              <CheckBox
                disabled={isUpdating}
                key={index}
                id={status}
                readOnly={true}
                onClick={() => submitExclusion(status)}
                containerClassName='mr-4 mb-4'
                checked={!formattedExclusions.includes(status)}
                label={t(`validatorStatus.${status}`)}
              />
            ))}
          </div>
        </SimpleSection>
      </div>
    </div>
  )
}

export default DataSettings
