import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import LighthousePng from '../../assets/images/lighthouse-dark.png'
import Button, { ButtonFace } from '../Button/Button'
import Typography, { TypographyType } from '../Typography/Typography'

export interface ValidatorTableEmptyStateProps {
  href?: string
  onClick?: () => void
  className?: string
  ctaText: string
  btnFontType?: TypographyType
}

const ValidatorTableEmptyState: FC<ValidatorTableEmptyStateProps> = ({
  href,
  onClick,
  className,
  ctaText,
  btnFontType,
}) => {
  const { t } = useTranslation()
  const containerClasses = clsx(
    'w-full p-8 flex items-center justify-center bg-dark10 dark:bg-dark700',
    className,
  )
  const btnContent = (
    <Button onClick={onClick} fontType={btnFontType} type={ButtonFace.SECONDARY}>
      {ctaText}
    </Button>
  )

  return (
    <div className={containerClasses}>
      <div className='flex flex-col items-center space-y-2'>
        <Typography type='text-caption'>{t('emptyState.validatorTable.noConnections')}</Typography>
        <div className='h-[64px] w-[64px] flex items-center justify-center rounded-full dark:bg-dark600 opacity-60'>
          <Image
            alt='lighthouse'
            className='opacity-90'
            height={64}
            width={64}
            src={LighthousePng}
          />
        </div>
        <div className='flex flex-col items-center space-y-2 max-w-[250px]'>
          <Typography type='text-caption1.5' className='text-center'>
            {t('emptyState.validatorTable.importOrDeposit')}
          </Typography>
          {href ? <Link href={href}>{btnContent}</Link> : btnContent}
        </div>
      </div>
    </div>
  )
}

export default ValidatorTableEmptyState
