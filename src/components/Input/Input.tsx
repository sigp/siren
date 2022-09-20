import {FC, HTMLInputTypeAttribute, InputHTMLAttributes, useState} from "react";
import Typography from "../Typography/Typography";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    label?: string,
    tooltip?: string,
    error?: string
}

const Input:FC<InputProps> = ({label, error, tooltip, type, ...props}) => {
    const [inputType, setType] = useState<HTMLInputTypeAttribute>(type || 'text');
    const isPasswordType = type === 'password';

    const togglePassword = () => setType(prev => prev === 'password' ? 'text' : 'password');
  return (
      <div className="space-y-4 w-full">
          {label && (
              <div className="flex items-center space-x-2">
                  <Typography isBold family="font-archivo" color="text-dark500" className="uppercase" type="text-caption1">{label}</Typography>
                  {tooltip && <i className="bi-question-circle-fill text-caption1 text-dark500" />}
              </div>
          )}
          <div className="relative w-full">
              <input {...props} type={inputType} className={`${isPasswordType ? 'pr-5' : ''} w-full bg-transparent placeholder:text-dark500 font-light font-openSauce outline-none text-white border-b border-white text-subtitle1`}/>
              {isPasswordType && <i onClick={togglePassword} className={`cursor-pointer ${inputType === 'password' ? 'bi-eye-slash-fill' : 'bi-eye-fill'} text-dark500 absolute right-0 top-1/2 -translate-y-1/2`}/>}
          </div>
      </div>
  )
}

export default Input;