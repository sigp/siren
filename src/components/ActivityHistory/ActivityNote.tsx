import axios from 'axios'
import { motion } from 'framer-motion'
import { debounce } from 'lodash'
import moment from 'moment'
import Link from 'next/link'
import React, { FC, useCallback, useEffect, useMemo } from 'react'
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
    } catch (e) {
      console.error('invalid json format')
      return null
    }
  }, [data])

  const formattedTitle = useMemo(() => {
    switch (type) {
      case ActivityType.DEPOSIT:
        return t('activityHistory.activities.deposit.title')
      case ActivityType.IMPORT:
        return t('activityHistory.activities.validatorImport.title')
      case ActivityType.GRAFFITI:
        return t('activityHistory.activities.updateGraffiti.title')
      case ActivityType.CONSOLIDATION:
        return t('activityHistory.activities.consolidation.title')
      default:
        return ''
    }
  }, [type, t])

  const getText = useCallback(() => {
    switch (type) {
      case ActivityType.DEPOSIT:
        return (
          <Typography color='text-dark400' darkMode='dark:text-dark400' type='text-caption1'>
            <Trans
              i18nKey='activityHistory.activities.deposit.text'
              components={{ span: <span className='underline font-bold' /> }}
              values={{ txHash: formatEthAddress(formattedData?.txHash) }}
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
      case ActivityType.CONSOLIDATION:
        let transKey = 'targetConsolidationText'
        const targetPubKey = formattedData?.targetPubKey
        const sourcePubKey = formattedData?.sourcePubKey

        if (targetPubKey === sourcePubKey) {
          transKey = 'selfConsolidationText'
        }

        return (
          <Typography color='text-dark400' darkMode='dark:text-dark400' type='text-caption1'>
            <Trans
              i18nKey={`activityHistory.activities.consolidation.${transKey}`}
              components={{ span: <span className='underline font-bold' /> }}
              values={{
                pubKey: formatEthAddress(targetPubKey),
                sourcePubKey: formatEthAddress(sourcePubKey),
              }}
            />
          </Typography>
        )
      default:
        return null
    }
  }, [type, pubKey, formattedData])

  const formattedIcon = useMemo(() => {
    switch (type) {
      case ActivityType.DEPOSIT:
        return 'bi-currency-exchange'
      case ActivityType.IMPORT:
        return 'bi-download'
      case ActivityType.GRAFFITI:
        return 'bi-palette'
      case ActivityType.CONSOLIDATION:
        return 'bi-intersect'
      default:
        return 'bi-clock-history'
    }
  }, [type])

  const formattedHref = useMemo(() => {
    const isValidNetwork =
      Number(networkId) === NetworkId.HOLESKY || Number(networkId) === NetworkId.MAINNET

    if (!isValidNetwork) return null

    switch (type) {
      case ActivityType.IMPORT:
        return getBeaconChaLink(networkId, `/validator/${pubKey}`)
      case ActivityType.DEPOSIT:
      case ActivityType.CONSOLIDATION:
        return formattedData ? getEtherscanLink(networkId, `/tx/${formattedData.txHash}`) : null
      default:
        return null
    }
  }, [type, networkId, pubKey, formattedData])

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

  const renderNote = useCallback(() => {
    const fromNow = moment(createdAt).fromNow()
    return (
      <div className='w-full flex items-center justify-between'>
        <div className='flex flex-1 max-w-[500px] items-center space-x-6'>
          <div className='h-12 w-12 bg-gradient-to-r from-primary to-tertiary rounded-full flex items-center justify-center'>
            <i className={`${formattedIcon} text-white text-subtitle2`} />
          </div>
          <div className='flex-1'>
            <Typography color='text-dark700'>{formattedTitle}</Typography>
            <div className='mt-1.5'>
              {getText()}
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
  }, [formattedHref, getText, hasSeen, formattedTitle, formattedIcon, createdAt])

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
