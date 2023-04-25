import { toast } from 'react-toastify'

const displayToast = (message: string, type: 'error' | 'success', options?: any) => {
  const toastOptions = {
    position: options?.position || 'top-right',
    autoClose: options?.autoClose || 5000,
    style: type === 'success' ? { background: '#70D370' } : undefined,
    theme: options?.theme || 'colored',
    hideProgressBar: options?.hideProgressBar || true,
    closeOnClick: options?.closeOnClick || true,
    pauseOnHover: options?.pauseOnHover || true,
  }

  toast[type](message, toastOptions)
}

export default displayToast
