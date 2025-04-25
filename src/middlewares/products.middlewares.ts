import { checkSchema } from 'express-validator'
import { PRODUCTS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const createProductValidator = validate(checkSchema({}))
