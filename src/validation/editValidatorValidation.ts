import * as yup from 'yup'

export const editValidatorValidation = yup.object().shape({
  nameString: yup
    .string()
    .required('Name is required')
    .max(19, 'Name cannot exceed 19 characters')
    .trim()
    .required()
    .notOneOf(['']),
})
