import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const createRatingValidator = validate(
  checkSchema(
    {
      star: {
        isInt: {
          errorMessage: 'Star must be an integer',
          options: {
            min: 1,
            max: 5
          }
        }
      },
      comment: {
        optional: true,
        isString: {
          errorMessage: 'Comment must be a string'
        }
      }
    },
    ['body']
  )
)
