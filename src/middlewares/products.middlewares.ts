import { checkSchema } from 'express-validator'
import { PRODUCTS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const createProductValidator = validate(
  checkSchema(
    {
      category_id: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.CATEGORY_ID_REQUIRED
        }
      },
      name: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.NAME_REQUIRED
        }
      },
      description: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.DESCRIPTION_REQUIRED
        }
      },
      price: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.PRICE_REQUIRED
        },
        isNumeric: {
          errorMessage: PRODUCTS_MESSAGES.PRICE_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(PRODUCTS_MESSAGES.PRICE_MUST_BE_A_POSITIVE_NUMBER)
            }
            return true
          }
        }
      },
      sizes: {
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.SIZES_REQUIRED
        }
      }
    },
    ['body']
  )
)

export const updateProductValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        notEmpty: {
          errorMessage: PRODUCTS_MESSAGES.NAME_REQUIRED
        }
      },
      price: {
        optional: true,
        isNumeric: {
          errorMessage: PRODUCTS_MESSAGES.PRICE_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(PRODUCTS_MESSAGES.PRICE_MUST_BE_A_POSITIVE_NUMBER)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
