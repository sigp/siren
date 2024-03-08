import i18n from 'i18next'
import * as yup from 'yup'

export const configValidation = yup.object().shape({
  apiToken: yup.string().required(i18n.t('error.apiTokenRequired')),
  userName: yup
    .string()
    .required(i18n.t('error.userName.required'))
    .max(14, i18n.t('error.userName.maxLength')),
})
