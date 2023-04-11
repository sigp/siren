import * as yup from 'yup'
import i18n from 'i18next'

export const sessionAuthValidation = yup.object().shape({
  password: yup
    .string()
    .required()
    .min(12, i18n.t('error.sessionAuth.length'))
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[$&+,:;=?@#|'<>.^*()%!-]/, 'Password must contain at least one special character'),
  password_confirmation: yup
    .string()
    .required()
    .oneOf([yup.ref('password'), null], 'error.sessionAuth.passwordMatch')
    .required('error.sessionAuth.confirmationRequired'),
})
