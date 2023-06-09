import * as yup from 'yup'
import i18n from 'i18next'

export const editValidatorValidation = yup.object().shape({
  nameString: yup
    .string()
    .required(i18n.t('validatorEdit.nameRequired'))
    .max(19, i18n.t('validatorEdit.nameLimit'))
    .trim()
    .required()
    .notOneOf(['']),
})
