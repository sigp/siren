import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { chunk } from 'lodash'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import displayToast from '../../../utilities/displayToast'
import useClickOutside from '../../hooks/useClickOutside'
import useSSEData from '../../hooks/useSSEData'
import { Activity, ActivityResponse, NetworkId, ToastType } from '../../types'
import Button, { ButtonFace } from '../Button/Button'
import FlexedOverflow from '../FlexedOverflow/FlexedOverflow'
import Typography from '../Typography/Typography'
import ActivityNote from './ActivityNote'

export interface ActivityHistoryProps {
  initActivityData: ActivityResponse
  depositNetworkId: NetworkId
}

const ActivityHistory: FC<ActivityHistoryProps> = ({ initActivityData, depositNetworkId }) => {
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [isDelayOffset, setIsDelayOffset] = useState(false)
  const [data, setData] = useState<Activity[]>(initActivityData.rows)
  const [isLoading, setLoading] = useState(false)

  const { data: streamedData } = useSSEData({
    url: '/activity-stream',
    isReady: true,
    isStateStore: true,
  })

  useEffect(() => {
    if (streamedData.length) {
      setData((prevData) => addData(prevData, streamedData as any))
    }
  }, [streamedData])

  const addData = (prevData: Activity[], data: Activity[]) => {
    const dataMap = new Map<number, Activity>(prevData.map((item) => [item.id, item]))

    data.forEach((item: Activity) => {
      dataMap.set(item.id, item)
    })
    return Array.from(dataMap.values())
  }

  const [isOpenHistory, setIsOpenHistory] = useState(false)

  const openHistory = () => setIsOpenHistory(true)
  const closeHistory = () => setIsOpenHistory(false)
  const fetchNextPage = async () => {
    if (data.length >= initActivityData.count) return

    setIsDelayOffset(false)

    setLoading(true)

    const newPage = page + 1
    try {
      const response = await axios.get(`/api/activity?offset=${newPage * 10}`)
      setData((prevData) => addData(prevData, response.data.rows))
      setPage(newPage)
    } catch (e) {
      displayToast(t('activityHistory.unableToFetch'), ToastType.ERROR)
    } finally {
      setLoading(false)
    }
  }

  const updateNoteHasSeen = (id: number) => {
    const index = data.findIndex((item) => item.id === id)
    if (index !== -1) {
      const updatedNotes = [...data]
      updatedNotes[index] = {
        ...updatedNotes[index],
        hasSeen: true,
      }
      setData(updatedNotes)
    }
  }

  const { ref } = useClickOutside(() => closeHistory())

  const hasUnseenHistory = data.some((row) => !row.hasSeen)

  const sortedHistory = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [data])

  const chunkedHistory = useMemo(() => {
    return chunk(sortedHistory, 10)
  }, [sortedHistory])

  return (
    <>
      <Button
        onClick={openHistory}
        className='hidden md:block items-center border-l-style'
        type={ButtonFace.ICON}
      >
        <div className='relative'>
          {hasUnseenHistory && (
            <div className='w-3 h-3 bg-error rounded-full absolute top-0 -right-1' />
          )}
          <i className='bi bi-clock-history text-2xl text-dark300' />
        </div>
      </Button>
      <AnimatePresence>
        {isOpenHistory && (
          <div className='fixed z-30 h-screen w-screen top-0 left-0'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0, transition: { delay: 0.3 } }}
              transition={{ duration: 0.2 }}
              className='w-full h-full bg-black'
            />
            <div className='absolute overflow-hidden top-0 right-0 h-screen w-1/2'>
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3, type: 'spring', delay: 0.2 }}
                exit={{ x: '100%' }}
                ref={ref as any}
                className='p-8 w-full h-full flex flex-col bg-white dark:bg-dark750'
              >
                <div className='py-8 border-b-style mb-8'>
                  <div
                    onClick={closeHistory}
                    className='flex items-center space-x-4 cursor-pointer'
                  >
                    <i className='dark:text-dark300 text-dark900 bi bi-arrow-left-short text-subtitle1' />
                    <Typography type='text-subtitle1'>{t('activityHistory.title')}</Typography>
                  </div>
                </div>
                {chunkedHistory.length ? (
                  <FlexedOverflow
                    isScrollAnim={isLoading}
                    onScrollBottom={fetchNextPage}
                    className='space-y-4'
                  >
                    {chunkedHistory.map((chunk) =>
                      chunk.map((activity, index) => (
                        <ActivityNote
                          key={index}
                          networkId={depositNetworkId}
                          onHasSeen={updateNoteHasSeen}
                          delayOffset={isDelayOffset ? 0.2 : undefined}
                          index={index}
                          activity={activity}
                        />
                      )),
                    )}
                  </FlexedOverflow>
                ) : (
                  <div>
                    <Typography>{t('activityHistory.noActivity')}</Typography>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ActivityHistory
