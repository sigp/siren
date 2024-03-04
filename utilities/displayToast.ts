import { toast } from 'react-toastify'
import { ToastType } from '../src/types'
import { ToastOptions } from 'react-toastify/dist/types'

const displayToast = (message: string, type: ToastType, options?: ToastOptions) => {
  const toastOptions = {
    position: options?.position || 'top-right',
    autoClose: options?.autoClose ?? 5000,
    style: type === ToastType.SUCCESS ? { background: '#70D370' } : undefined,
    theme: options?.theme || 'colored',
    hideProgressBar: options?.hideProgressBar || true,
    closeOnClick: options?.closeOnClick || true,
    pauseOnHover: options?.pauseOnHover || true,
  }

  if (type === ToastType.SUCCESS) {
    toast.success(message, toastOptions)
  } else {
    toast.error(message, toastOptions)
  }
}

export default displayToast
