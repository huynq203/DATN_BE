import { NextFunction, Request, Response } from 'express'
import { checkSchema, ParamSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { COMMONS_MESSAGES, CUSTOMERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Error'
import databaseService from '~/services/database.services'
import { verifyAccessToken } from '~/utils/common'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

export const nameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: COMMONS_MESSAGES.NAME_IS_REQUIRED
  },
  isString: {
    errorMessage: COMMONS_MESSAGES.NAME_MUST_BE_A_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 50
    },
    errorMessage: COMMONS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_50
  }
}
export const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: COMMONS_MESSAGES.PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: COMMONS_MESSAGES.PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: COMMONS_MESSAGES.PASSWORD_LENGHT_MUST_BE_FROM_6_to_50
  },
  isStrongPassword: {
    options: {
      minLength: 1,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: COMMONS_MESSAGES.PASSWORD_MUST_BE_STRONG
  }
}

export const confirmPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: COMMONS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: COMMONS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(COMMONS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
      }
      return true
    }
  }
}
export const dateOfBirthSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: COMMONS_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601
  }
}

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage: COMMONS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1]
            return await verifyAccessToken(access_token, req as Request)
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: COMMONS_MESSAGES.REFRESH_TOKEN_IS_INVALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET as string }),
                databaseService.refreshTokens.findOne({ token: value })
              ])
              if (refresh_token === null) {
                throw new ErrorWithStatus({
                  message: COMMONS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              ;(req as Request).decoded_refresh_token = decoded_refresh_token
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
    },
    ['body']
  )
)

export const isLoggedInVaidator = (middleware: (req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //req.header vs req.headers
    // console.log(req.header('authorization'))
    //header là 1 function => Không biệt chữ hoa và chữ thường Authorization và authorization
    //headers thì quy định chữ hoa chữ thường
    if (req.headers.authorization) {
      //Có accestoken thì check không thì bỏ qua
      middleware(req, res, next)
      return
    }
    next()
  }
}
