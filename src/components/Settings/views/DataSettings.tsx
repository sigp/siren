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

  const statusGroups = [
    {
      title: 'Active Validators',
      description: 'Validators currently participating in consensus',
      statuses: [
        'active',
        'active_ongoing',
        'active_exiting',
        'active_slashed',
      ] as ValidatorStatus[],
    },
    {
      title: 'Pending Validators',
      description: 'Validators waiting to become active',
      statuses: [
        'pending',
        'pending_initialized',
        'pending_queued',
        'deposit',
      ] as ValidatorStatus[],
    },
    {
      title: 'Exited Validators',
      description: 'Validators that have stopped validating',
      statuses: ['exited', 'exited_unslashed', 'exited_slashed'] as ValidatorStatus[],
    },
    {
      title: 'Withdrawal Validators',
      description: 'Validators in the withdrawal process',
      statuses: ['withdrawal', 'withdrawal_possible', 'withdrawal_done'] as ValidatorStatus[],
    },
  ]

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

  const toggleGroup = async (groupStatuses: ValidatorStatus[]) => {
    try {
      setIsUpdating(true)

      // Check if all statuses in the group are currently shown (not excluded)
      const allGroupStatusesShown = groupStatuses.every(
        (status) => !formattedExclusions.includes(status),
      )

      if (allGroupStatusesShown) {
        // Hide all statuses in the group by adding exclusions
        const addPromises = groupStatuses.map((status) => addExclusion(status))
        await Promise.all(addPromises)
      } else {
        // Show all statuses in the group by removing exclusions
        const statusesToRemove = exclusions.filter((exclusion) =>
          groupStatuses.includes(exclusion.status),
        )
        const removePromises = statusesToRemove.map((exclusion) => deleteExclusion(exclusion.id))
        await Promise.all(removePromises)
      }
    } catch (error) {
      console.error('Failed to toggle group:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const isGroupFullyShown = (groupStatuses: ValidatorStatus[]) => {
    return groupStatuses.every((status) => !formattedExclusions.includes(status))
  }

  const isGroupPartiallyShown = (groupStatuses: ValidatorStatus[]) => {
    const shownStatuses = groupStatuses.filter((status) => !formattedExclusions.includes(status))
    return shownStatuses.length > 0 && shownStatuses.length < groupStatuses.length
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
          <div className='pt-8 order-1 w-full md:order-2 mb-8 md:mb-0 space-y-6'>
            {statusGroups.map((group, groupIndex) => {
              const groupFullyShown = isGroupFullyShown(group.statuses)
              const groupPartiallyShown = isGroupPartiallyShown(group.statuses)

              return (
                <div key={groupIndex} className='space-y-3'>
                  <div className='space-y-1'>
                    <div className='flex items-center justify-between'>
                      <h4 className='text-sm font-medium text-dark900 dark:text-dark300'>
                        {group.title}
                      </h4>
                      <CheckBox
                        disabled={isUpdating}
                        id={`group-${groupIndex}`}
                        readOnly={true}
                        onClick={() => toggleGroup(group.statuses)}
                        containerClassName='flex-shrink-0'
                        checked={groupFullyShown}
                        label={groupFullyShown ? 'Hide All' : 'Show All'}
                        className={groupPartiallyShown ? 'opacity-60' : ''}
                      />
                    </div>
                    <p className='text-xs text-dark500 dark:text-dark400'>{group.description}</p>
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {group.statuses.map((status, statusIndex) => (
                      <CheckBox
                        disabled={isUpdating}
                        key={statusIndex}
                        id={status}
                        readOnly={true}
                        onClick={() => submitExclusion(status)}
                        containerClassName='w-full'
                        checked={!formattedExclusions.includes(status)}
                        label={t(`validatorStatus.${status}`)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </SimpleSection>
      </div>
    </div>
  )
}

export default DataSettings
