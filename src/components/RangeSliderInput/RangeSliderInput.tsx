import { FC, InputHTMLAttributes } from 'react'

export interface RangeSliderInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  className?: string | undefined
}

const RangeSliderInput: FC<RangeSliderInputProps> = ({ id, className, label, ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label for='steps-range-slider-usage' class='sr-only'>
          {label}
        </label>
      )}
      <input
        type='range'
        className='w-full bg-transparent cursor-pointer appearance-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none
              [&::-webkit-slider-thumb]:w-2
              [&::-webkit-slider-thumb]:h-2
              [&::-webkit-slider-thumb]:-mt-0.5
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:bg-primary
              [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_rgba(204,175,255,1)]
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:transition-all
              [&::-webkit-slider-thumb]:duration-150
              [&::-webkit-slider-thumb]:ease-in-out
              [&::-webkit-slider-thumb]:

              [&::-moz-range-thumb]:w-2
              [&::-moz-range-thumb]:h-2
              [&::-moz-range-thumb]:appearance-none
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-4
              [&::-moz-range-thumb]:border-primary
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:transition-all
              [&::-moz-range-thumb]:duration-150
              [&::-moz-range-thumb]:ease-in-out

              [&::-webkit-slider-runnable-track]:w-full
              [&::-webkit-slider-runnable-track]:h-1
              [&::-webkit-slider-runnable-track]:bg-dark500
              [&::-webkit-slider-runnable-track]:rounded-full
              [&::-webkit-slider-runnable-track]:

              [&::-moz-range-track]:w-full
              [&::-moz-range-track]:h-1
              [&::-moz-range-track]:bg-gray-100
              [&::-moz-range-track]:rounded-full'
        id={id}
        aria-orientation='horizontal'
        {...props}
      />
    </div>
  )
}

export default RangeSliderInput
