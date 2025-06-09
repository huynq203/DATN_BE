import { checkSchema, ParamSchema } from 'express-validator'
import { COMMONS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'
import { confirmPasswordSchema, dateOfBirthSchema, nameSchema, passwordSchema } from './commons.middlewares'
import usersService from '~/services/users.services'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { StatusType } from '~/constants/enums'
import { TokenPayload } from '~/models/requests/Customer.requests'
import { ObjectId } from 'mongodb'

const NewPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: USERS_MESSAGES.PASSWORD_LENGHT_MUST_BE_FROM_6_to_50
  },
  isStrongPassword: {
    options: {
      minLength: 1,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: USERS_MESSAGES.PASSWORD_NEW_MUST_BE_STRONG
  }
}

const confirmNewPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: USERS_MESSAGES.CONFRIM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
      }
      return true
    }
  }
}
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
            if (user.status === StatusType.Inactive) {
              throw new Error(COMMONS_MESSAGES.USER_IS_LOCKED)
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
      date_of_birth: dateOfBirthSchema
    },
    ['body']
  )
)

export const updateUserValidator = validate(
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
      password: passwordSchema,
      confirm_password: confirmPasswordSchema
    },
    ['body']
  )
)

export const changePasswordValidatorUser = validate(
  checkSchema(
    {
      old_password: {
        ...passwordSchema,
        custom: {
          options: async (value, { req }) => {
            const { user_id } = req.decoded_authorization as TokenPayload
            const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
            if (!user) {
              throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
            }
            const { password } = user
            const isMatch = hashPassword(value) === password
            if (!isMatch) {
              throw new Error(USERS_MESSAGES.OLD_PASSWORD_NOT_MATCH)
            }
          }
        }
      },
      new_password: NewPasswordSchema,
      confirm_new_password: confirmNewPasswordSchema
    },
    ['body']
  )
)
