import * as yup from 'yup'

export const configValidation = yup.object().shape({
  apiToken: yup.string().required(),
})
