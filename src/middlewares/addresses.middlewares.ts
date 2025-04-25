import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const createAddressValidator = validate(checkSchema({}))

export const updateAddressValidator = validate(checkSchema({}))

export const deleteAddressValidator = validate(checkSchema({}))
