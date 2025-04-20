import { checkSchema } from 'express-validator'
import { COMMONS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'
import { confirmPasswordSchema, dateOfBirthSchema, nameSchema, PasswordSchema } from './commons.middlewares'
import usersService from '~/services/users.services'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'

export const loginUserValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: COMMONS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (user === null) {
              throw new Error(COMMONS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
            }
            //Truyen req.user sang controller
            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: COMMONS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: COMMONS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        }
      }
    },
    ['body']
  )
)

export const createUserValidator = validate(
  checkSchema(
    {
      name: nameSchema,
      email: {
        isEmail: {
          errorMessage: COMMONS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isEmailExist = await usersService.checkEmailUserExist(value)
            if (isEmailExist) {
              throw new Error(COMMONS_MESSAGES.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      phone: {
        notEmpty: {
          errorMessage: COMMONS_MESSAGES.PHONE_IS_REQUIRED
        },
        trim: true,
        isLength: {
          options: {
            max: 10
          },
          errorMessage: COMMONS_MESSAGES.PHONE_IS_INVALID
        },
        custom: {
          options: async (value) => {
            const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
            if (value.length !== 10 || !regexPhoneNumber.test(value)) {
              throw new Error(COMMONS_MESSAGES.PHONE_IS_INVALID)
            }
            const phone = await usersService.checkPhoneUserExist(value)
            if (phone) {
              throw new Error(COMMONS_MESSAGES.PHONE_IS_EXISTS)
            }
          }
        }
      },
      date_of_birth: dateOfBirthSchema,
      password: PasswordSchema,
      confirm_password: confirmPasswordSchema
    },
    ['body']
  )
)
