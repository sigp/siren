import { AnimationControls } from 'framer-motion'
import { FC } from 'react'
import addClassString from '../../../../utilities/addClassString'
import { AddValidatorOption, ValidatorManagementView } from '../../../types'
import AddValidatorAction from '../../AddValidatorAction/AddValidatorAction'

export interface AddValOptionProps {
  data: AddValidatorOption
  animControls: AnimationControls
  onChangeView: (view: ValidatorManagementView) => void
  index: number
}

const AddValOption: FC<AddValOptionProps> = ({ data, onChangeView, animControls, index }) => {
  const { isDisabled, view, isRecommended, title, subTitle, caption, SVG } = data
  const containerClass = addClassString('flex-1 w-full lg:max-w-80 h-[409px]', [
    isDisabled && 'opacity-15 dark:opacity-40 pointer-events-none',
  ])
  return (
    <div className={containerClass}>
      <AddValidatorAction
        onClick={() => onChangeView(view)}
        animate={animControls}
        initial={{ x: 40, opacity: 0 }}
        isRecommended={isRecommended}
        index={index}
        title={title}
        subTitle={subTitle}
        caption={caption}
      >
        <SVG className='absolute left-1/2 inset-0 top-[50px] z-20 w-full lg:w-[300px] h-[300px]' />
      </AddValidatorAction>
    </div>
  )
}

export default AddValOption
