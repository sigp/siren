import axios from 'axios'
import { motion } from 'framer-motion'
import { debounce } from 'lodash'
import moment from 'moment'
import Link from 'next/link'
import React, { FC, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import displayToast from '../../../utilities/displayToast'
import getActivityTitleKey from '../../../utilities/getActivityTitleKey'
import getBeaconChaLink from '../../../utilities/getBeaconChaLink'
import getEtherscanLink from '../../../utilities/getEtherscanLink'
import isValidNetwork from '../../../utilities/isValidNetwork'
import { Status } from '../../constants/enums'
import { Activity, ActivityType, NetworkId, ToastType } from '../../types'
import Typography from '../Typography/Typography'
import ActivityIcon from './ActivityIcon'
import ActivityText from './ActivityText'

export interface ActivityNoteProps {
  activity: Activity
  index?: number
  delayOffset?: number | undefined
  networkId: NetworkId
  onHasSeen: (id: number) => void
}

const ActivityNote: FC<ActivityNoteProps> = ({
  activity,
  index,
  delayOffset,
  networkId,
  onHasSeen,
}) => {
  const { t } = useTranslation()
  const { id, type, createdAt, data, pubKey, hasSeen, status } = activity
  const initialAnim = useMemo(() => ({ x: 100, opacity: 0 }), [])
  const animateAnim = useMemo(() => ({ x: 0, opacity: 1 }), [])
  const transAnim = useMemo(
    () => ({ duration: 0.2, delay: 0.1 * (index || 0) + (delayOffset || 0) }),
    [index, delayOffset],
  )

  const formattedData = useMemo(() => {
    if (!data) return null

    try {
      return JSON.parse(data)
    } catch (_) {
      console.error('invalid json format')
      return null
    }
  }, [data])

  const isError = status.toUpperCase() === Status.ERROR
  const formattedTitle = t(getActivityTitleKey(type, isError))
  const fromNow = moment(createdAt).fromNow()

  let formattedHref: string | null = null
  if (isValidNetwork(networkId)) {
    if (type === ActivityType.IMPORT) {
      formattedHref = getBeaconChaLink(networkId, `/validator/${pubKey}`)
    } else if (
      [ActivityType.DEPOSIT, ActivityType.CONSOLIDATION, ActivityType.PARTIAL_WITHDRAWAL].includes(
        type,
      )
    ) {
      formattedHref = formattedData?.txHash
        ? getEtherscanLink(networkId, `/tx/${formattedData.txHash}`)
        : null
    }
  }

  const markAsSeen = useCallback(
    debounce(async () => {
      if (hasSeen) return
      try {
        const { status } = await axios.put(`/api/read-activity/${id}`)
        if (status === 200) {
          onHasSeen(id)
        }
      } catch (e) {
        console.error(e)
        displayToast(t('error.unableUpdateActivity'), ToastType.ERROR)
      }
    }, 300),
    [hasSeen, id, onHasSeen, t],
  )

  useEffect(() => {
    return () => {
      markAsSeen.cancel()
    }
  }, [markAsSeen])

  const renderNote = () => (
    <div className='w-full flex items-center justify-between'>
      <div className='flex flex-1 max-w-[500px] items-center space-x-6'>
        <ActivityIcon isError={isError} type={type} />
        <div className='flex-1'>
          <Typography color='text-dark700'>{formattedTitle}</Typography>
          <div className='mt-1.5'>
            <ActivityText
              type={type}
              status={status}
              pubKey={pubKey}
              formattedData={formattedData}
            />
            <Typography
              color='text-dark400'
              darkMode='dark:text-dark400'
              isBold
              type='text-caption1'
            >
              {fromNow}
            </Typography>
          </div>
        </div>
      </div>
      <div>
        {!hasSeen ? (
          <div className='h-4 w-4 bg-primary rounded-full' />
        ) : formattedHref ? (
          <i className='text-dark400 text-subtitle3 bi-box-arrow-up-right' />
        ) : null}
      </div>
    </div>
  )

  return (
    <motion.div
      onMouseEnter={markAsSeen}
      initial={initialAnim}
      animate={animateAnim}
      transition={transAnim}
      className='p-4 border-style'
    >
      {formattedHref ? (
        <Link target='_blank' rel='noopener noreferrer' href={formattedHref}>
          {renderNote()}
        </Link>
      ) : (
        renderNote()
      )}
    </motion.div>
  )
}

export default ActivityNote
