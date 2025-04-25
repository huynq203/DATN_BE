import { Request, Response, NextFunction } from 'express'
import { checkSchema, ParamSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { COMMONS_MESSAGES, CUSTOMERS_MESSAGES, JWT_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Error'
import databaseService from '~/services/database.services'
import customerService from '~/services/customers.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'
import { confirmPasswordSchema, dateOfBirthSchema, nameSchema, passwordSchema } from './commons.middlewares'
import { UserVerifyStatus } from '~/constants/enums'
import { TokenPayload } from '~/models/requests/Customer.requests'
import { ObjectId } from 'mongodb'

const NewPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: CUSTOMERS_MESSAGES.PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: CUSTOMERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: CUSTOMERS_MESSAGES.PASSWORD_LENGHT_MUST_BE_FROM_6_to_50
  },
  isStrongPassword: {
    options: {
      minLength: 1,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: CUSTOMERS_MESSAGES.PASSWORD_MUST_BE_STRONG
  }
}

const confirmNewPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: CUSTOMERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: CUSTOMERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: CUSTOMERS_MESSAGES.CONFRIM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error(CUSTOMERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
      }
      return true
    }
  }
}

const forgotPasswordTokenSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: CUSTOMERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }
      try {
        const decoded_password_verify_token = await verifyToken({
          token: value,
          secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_VERIFY_TOKEN as string
        })
        ;(req as Request).decoded_password_verify_token = decoded_password_verify_token
        const { customer_id } = decoded_password_verify_token
        const customer = await databaseService.customers.findOne({ _id: new ObjectId(customer_id) })
        if (customer === null) {
          throw new ErrorWithStatus({
            message: CUSTOMERS_MESSAGES.CUSTOMER_NOT_FOUND,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        if (customer.forgot_password_token !== value) {
          throw new ErrorWithStatus({
            message: CUSTOMERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new ErrorWithStatus({
            message: capitalize(error.message),
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        throw error
      }
      return true
    }
  }
}

export const registerValidator = validate(
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
            const isEmailExist = await customerService.checkEmailExist(value)
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
            const phone = await customerService.checkPhoneExist(value)
            if (phone) {
              throw new Error(COMMONS_MESSAGES.PHONE_IS_EXISTS)
            }
          }
        }
      },
      password: passwordSchema,
      confirm_password: confirmPasswordSchema
    },
    ['body']
  )
)
export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: COMMONS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const customer = await databaseService.customers.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (customer === null) {
              throw new Error(COMMONS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
            }
            //Truyen req.user sang controller
            req.customer = customer
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

export const verifiedCustomerValidator = (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decoded_authorization as TokenPayload
  if (verify !== UserVerifyStatus.Verified) {
    return next(
      new ErrorWithStatus({
        message: CUSTOMERS_MESSAGES.CUSTOMER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }
  next()
}

export const verifyEmailTokenValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: CUSTOMERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_INVALID,
                status: 402
              })
            }
            const decoded_email_verify_token = await verifyToken({
              token: value,
              secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
            })
            ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: CUSTOMERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const customer = await databaseService.customers.findOne({ email: value })
            if (customer === null) {
              throw new Error(CUSTOMERS_MESSAGES.EMAIL_NOT_FOUND)
            }
            req.customer = customer
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyForgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_password_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: CUSTOMERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decoded_password_verify_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_VERIFY_TOKEN as string
              })
              ;(req as Request).decoded_password_verify_token = decoded_password_verify_token
              const { customer_id } = decoded_password_verify_token
              const customer = await databaseService.customers.findOne({ _id: new ObjectId(customer_id) })
              if (customer === null) {
                throw new ErrorWithStatus({
                  message: CUSTOMERS_MESSAGES.CUSTOMER_NOT_FOUND,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              if (customer.forgot_password_token !== value) {
                throw new ErrorWithStatus({
                  message: CUSTOMERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(JWT_MESSAGES.JWT_EXPRIED),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      new_password: NewPasswordSchema,
      confirm_new_password: confirmNewPasswordSchema,
      forgot_password_token: forgotPasswordTokenSchema
    },
    ['body']
  )
)

export const changePasswordValidator = validate(
  checkSchema(
    {
      old_password: {
        ...passwordSchema,
        custom: {
          options: async (value, { req }) => {
            const { customer_id } = req.decoded_authorization as TokenPayload
            const customer = await databaseService.customers.findOne({ _id: new ObjectId(customer_id) })
            if (!customer) {
              throw new ErrorWithStatus({
                message: CUSTOMERS_MESSAGES.CUSTOMER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            const { password } = customer
            const isMatch = hashPassword(value) === password
            if (!isMatch) {
              throw new ErrorWithStatus({
                message: CUSTOMERS_MESSAGES.OLD_PASSWORD_NOT_MATCH,
                status: HTTP_STATUS.UNAUTHORIZED
              })
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
