import axios from 'axios'
import React, { FC, useState, useMemo } from 'react'
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
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [optimisticExclusions, setOptimisticExclusions] = useState<ValidatorStatus[]>([])
  const { exclusions, formattedExclusions, setExclusions } =
    useValidatorExclusionList(initExclusions)

  // Combine server state with optimistic updates
  const effectiveExclusions = useMemo(() => {
    return optimisticExclusions.length > 0 ? optimisticExclusions : formattedExclusions
  }, [optimisticExclusions, formattedExclusions])

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

  const setItemLoading = (status: ValidatorStatus, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [status]: loading }))
  }

  const deleteExclusion = async (id: number, status: ValidatorStatus) => {
    try {
      setItemLoading(status, true)
      const { data } = await axios.delete(`/api/remove-exclusion/${id}`)
      setExclusions(data)
      // Clear optimistic state once server responds
      setOptimisticExclusions([])
    } catch (e) {
      console.error(e)
      // Revert optimistic update on error
      setOptimisticExclusions([])
    } finally {
      setItemLoading(status, false)
    }
  }

  const addExclusion = async (status: ValidatorStatus) => {
    try {
      setItemLoading(status, true)
      const { data } = await axios.post('/api/add-exclusion', { status })
      setExclusions(data)
      // Clear optimistic state once server responds
      setOptimisticExclusions([])
    } catch (e) {
      console.error(e)
      // Revert optimistic update on error
      setOptimisticExclusions([])
    } finally {
      setItemLoading(status, false)
    }
  }

  const submitExclusion = async (selectedStatus: ValidatorStatus) => {
    const excludedStatus = exclusions.find(({ status }) => status === selectedStatus)

    // Apply optimistic update immediately
    if (excludedStatus) {
      // Currently excluded, so we're showing it (removing from exclusions)
      setOptimisticExclusions(effectiveExclusions.filter((status) => status !== selectedStatus))
      await deleteExclusion(excludedStatus.id, selectedStatus)
    } else {
      // Currently shown, so we're hiding it (adding to exclusions)
      setOptimisticExclusions([...effectiveExclusions, selectedStatus])
      void (await addExclusion(selectedStatus))
    }
  }

  const toggleGroup = async (groupStatuses: ValidatorStatus[]) => {
    try {
      // Set loading for entire group
      groupStatuses.forEach((status) => setItemLoading(status, true))

      // Check if all statuses in the group are currently shown (not excluded)
      const allGroupStatusesShown = groupStatuses.every(
        (status) => !effectiveExclusions.includes(status),
      )

      if (allGroupStatusesShown) {
        // Hide all statuses in the group by adding exclusions (optimistic update)
        setOptimisticExclusions([...effectiveExclusions, ...groupStatuses])

        // Execute API calls
        const addPromises = groupStatuses.map((status) =>
          axios.post('/api/add-exclusion', { status }),
        )
        await Promise.all(addPromises)
      } else {
        // Show all statuses in the group by removing exclusions (optimistic update)
        setOptimisticExclusions(
          effectiveExclusions.filter((status) => !groupStatuses.includes(status)),
        )

        // Execute API calls
        const statusesToRemove = exclusions.filter((exclusion) =>
          groupStatuses.includes(exclusion.status),
        )
        const removePromises = statusesToRemove.map((exclusion) =>
          axios.delete(`/api/remove-exclusion/${exclusion.id}`),
        )
        await Promise.all(removePromises)
      }

      // Refresh the complete state from server
      const { data } = await axios.get('/api/exclusions')
      setExclusions(data)
      setOptimisticExclusions([])
    } catch (error) {
      console.error('Failed to toggle group:', error)
      // Revert optimistic update on error
      setOptimisticExclusions([])
    } finally {
      // Clear loading for entire group
      groupStatuses.forEach((status) => setItemLoading(status, false))
    }
  }

  const isGroupFullyShown = (groupStatuses: ValidatorStatus[]) => {
    return groupStatuses.every((status) => !effectiveExclusions.includes(status))
  }

  const isGroupPartiallyShown = (groupStatuses: ValidatorStatus[]) => {
    const shownStatuses = groupStatuses.filter((status) => !effectiveExclusions.includes(status))
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
                        disabled={group.statuses.some((status) => loadingStates[status])}
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
                        disabled={loadingStates[status] || false}
                        key={statusIndex}
                        id={status}
                        readOnly={true}
                        onClick={() => submitExclusion(status)}
                        containerClassName='w-full'
                        checked={!effectiveExclusions.includes(status)}
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
