import { checkSchema } from 'express-validator'
import { ROLES_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const createRoleValidator = validate(
  checkSchema({
    role_name: {
      notEmpty: {
        errorMessage: ROLES_MESSAGES.ROLENAME_IS_REQUIRED
      },
      isString: {
        errorMessage: ROLES_MESSAGES.ROLENAME_MUST_BE_A_STRING
      }
    },
    description: {
      notEmpty: {
        errorMessage: ROLES_MESSAGES.DESCRIPTION_IS_REQUIRED
      }
    }
  })
)
