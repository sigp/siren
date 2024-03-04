import i18n from 'i18next'
import * as yup from 'yup'

export const sessionAuthValidation = yup.object().shape({
  password: yup
    .string()
    .min(12, i18n.t('error.sessionAuth.length'))
    .matches(/[a-z]/, i18n.t('error.sessionAuth.lowercaseRequired'))
    .matches(/[A-Z]/, i18n.t('error.sessionAuth.uppercaseRequired'))
    .matches(/[0-9]/, i18n.t('error.sessionAuth.numberRequired'))
    .matches(/[$&+,:;=?@#|'<>.^*()%!-]/, i18n.t('error.sessionAuth.specialCharRequired')),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], i18n.t('error.sessionAuth.passwordMatch'))
    .required(i18n.t('error.sessionAuth.confirmationRequired')),
})
