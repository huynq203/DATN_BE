import { checkSchema } from 'express-validator'
import { CATEGORIES_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const createCategoryValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: CATEGORIES_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: CATEGORIES_MESSAGES.NAME_MUST_BE_A_STRING
        },
        trim: true
      },
      description: {
        notEmpty: {
          errorMessage: CATEGORIES_MESSAGES.DESCRIPTION_IS_REQUIRED
        },
        isString: {
          errorMessage: CATEGORIES_MESSAGES.DESCRIPTION_MUST_BE_A_STRING
        },
        trim: true
      }
    },
    ['body']
  )
)

export const updateCategoryValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: CATEGORIES_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: CATEGORIES_MESSAGES.NAME_MUST_BE_A_STRING
        },
        trim: true
      },
      description: {
        notEmpty: {
          errorMessage: CATEGORIES_MESSAGES.DESCRIPTION_IS_REQUIRED
        },
        isString: {
          errorMessage: CATEGORIES_MESSAGES.DESCRIPTION_MUST_BE_A_STRING
        },
        trim: true
      }
    },
    ['body']
  )
)
