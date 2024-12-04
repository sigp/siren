import axios from 'axios'
import { motion } from 'framer-motion'
import moment from 'moment/moment'
import Link from 'next/link'
import React, { FC, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import displayToast from '../../../utilities/displayToast'
import formatEthAddress from '../../../utilities/formatEthAddress'
import getBeaconChaLink from '../../../utilities/getBeaconChaLink'
import getEtherscanLink from '../../../utilities/getEtherscanLink'
import { Activity, ActivityType, NetworkId, ToastType } from '../../types'
import Typography from '../Typography/Typography'

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
  const { id, type, createdAt, data, pubKey, hasSeen } = activity
  const hasLink = type === ActivityType.DEPOSIT || type === ActivityType.IMPORT

  const getTitle = (type: ActivityType) => {
    switch (type) {
      case ActivityType.DEPOSIT:
        return t('activityHistory.activities.deposit.title')
      case ActivityType.IMPORT:
        return t('activityHistory.activities.validatorImport.title')
      case ActivityType.GRAFFITI:
        return t('activityHistory.activities.updateGraffiti.title')
      default:
        return ''
    }
  }

  const getText = (type: ActivityType) => {
    switch (type) {
      case ActivityType.DEPOSIT:
        const activityData = JSON.parse(data)
        return (
          <Typography color='text-dark400' darkMode='dark:text-dark400' type='text-caption1'>
            <Trans
              i18nKey='activityHistory.activities.deposit.text'
              components={{ span: <span className='underline font-bold' /> }}
              values={{ txHash: formatEthAddress(activityData.txHash) }}
            />
          </Typography>
        )
      case ActivityType.IMPORT:
        return (
          <Typography color='text-dark400' darkMode='dark:text-dark400' type='text-caption1'>
            <Trans
              i18nKey='activityHistory.activities.validatorImport.text'
              components={{ span: <span className='underline font-bold' /> }}
              values={{ pubKey: formatEthAddress(pubKey) }}
            />
          </Typography>
        )
      case ActivityType.GRAFFITI:
        return (
          <Typography color='text-dark400' darkMode='dark:text-dark400' type='text-caption1'>
            <Trans
              i18nKey='activityHistory.activities.updateGraffiti.text'
              components={{ span: <span className='underline font-bold' /> }}
              values={{ pubKey: formatEthAddress(pubKey) }}
            />
          </Typography>
        )
      default:
        return null
    }
  }

  const getIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.DEPOSIT:
        return 'bi-currency-exchange'
      case ActivityType.IMPORT:
        return 'bi-download'
      case ActivityType.GRAFFITI:
        return 'bi-palette'
      default:
        return 'bi-clock-history'
    }
  }

  const getHref = (type: ActivityType) => {
    switch (type) {
      case ActivityType.IMPORT:
        return getBeaconChaLink(networkId, `/validator/${pubKey}`)
      case ActivityType.DEPOSIT:
        return data ? getEtherscanLink(networkId, `/tx/${JSON.parse(data).txHash}`) : ''
      default:
        return ''
    }
  }

  const markAsSeen = async () => {
    if (hasSeen) return

    try {
      const { status } = await axios.put(`/api/read-activity/${id}`, undefined)

      if (status === 200) {
        onHasSeen(id)
      }
    } catch (e) {
      console.error(e)
      displayToast('Unexpected Error occurred while updating Activity', ToastType.ERROR)
    }
  }

  const { title, text, isLink, icon, href } = useMemo(() => {
    return {
      title: getTitle(type),
      text: getText(type),
      icon: getIcon(type),
      href: getHref(type),
      isLink: type === ActivityType.IMPORT || type === ActivityType.DEPOSIT,
    }
  }, [type])

  const renderNote = () => {
    return (
      <div className='w-full flex items-center justify-between'>
        <div className='flex flex-1 max-w-[500px] items-center space-x-6'>
          <div className='h-12 w-12 bg-gradient-to-r from-primary to-tertiary rounded-full flex items-center justify-center'>
            <i className={`${icon} text-white text-subtitle2`} />
          </div>
          <div className='flex-1'>
            <Typography color='text-dark700'>{title}</Typography>
            <div className='mt-1.5'>
              <Typography color='text-dark400' darkMode='dark:text-dark400' type='text-caption1'>
                {text}
              </Typography>
              <Typography
                color='text-dark400'
                darkMode='dark:text-dark400'
                isBold
                type='text-caption1'
              >
                {moment(createdAt).fromNow()}
              </Typography>
            </div>
          </div>
        </div>
        <div>
          {!hasSeen ? (
            <div className='h-4 w-4 bg-primary rounded-full' />
          ) : isLink ? (
            <i className='text-dark400 text-subtitle3 bi-box-arrow-up-right' />
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      onMouseEnter={markAsSeen}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.1 * (index || 0) + (delayOffset || 0) }}
      className='p-4 border-style'
    >
      {hasLink ? (
        <Link target='_blank' href={href}>
          {renderNote()}
        </Link>
      ) : (
        renderNote()
      )}
    </motion.div>
  )
}

export default ActivityNote
