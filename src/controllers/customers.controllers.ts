import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  ChangePasswordReqBody,
  ChangeStatusReqBody,
  ForgotPasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  resetPassword,
  TokenPayload,
  UpdateProfileRequestBody,
  VerifyEmailReqBody,
  verifyForgotPasswordReqBody
} from '~/models/requests/Customer.requests'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import HTTP_STATUS from '~/constants/httpStatus'
import { StatusType, UserVerifyStatus } from '~/constants/enums'
import customersService from '~/services/customers.services'
import { COMMONS_MESSAGES, CUSTOMERS_MESSAGES } from '~/constants/messages'
import Customer from '~/models/schemas/Customer.schemas'
import dotenv from 'dotenv'

dotenv.config()

export const getAllCustomersController = async (req: Request, res: Response, next: NextFunction) => {
  const key_search = req.query.key_search as string
  const status = req.query.status as string
  const dateStart = req.query.dateStart as string
  const dateEnd = req.query.dateEnd as string
  const result = await customersService.getAllCustomers({ key_search, status, dateStart, dateEnd })
  res.json({
    message: CUSTOMERS_MESSAGES.GET_ALL_CUSTOMERS_SUCCESS,
    result
  })
}

export const getCustomerByIdController = async (req: Request, res: Response, next: NextFunction) => {
  const { customer_id } = req.params
  const result = await customersService.getCustomerById(customer_id)

  res.json({
    message: CUSTOMERS_MESSAGES.GET_CUSTOMER_BY_ID_SUCCESS,
    result
  })
}
export const deleteCustomerController = async (req: Request, res: Response, next: NextFunction) => {
  const { customer_id } = req.body
  await customersService.deleteCustomer(customer_id)
  res.json({
    message: CUSTOMERS_MESSAGES.DELETE_CUSTOMER_SUCCESS
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await customersService.register(req.body)
  res.json({
    message: CUSTOMERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
  return
}

export const loginController = async (
  req: Request<ParamsDictionary, any, LoginReqBody>,
  res: Response,
  next: NextFunction
) => {
  const customer = req.customer as Customer
  const customer_id = customer._id as ObjectId
  const verify = customer.verify as UserVerifyStatus
  const result = await customersService.login({ customer_id: customer_id.toString(), verify })
  res.cookie('refresh_token', result.refresh_token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
  res.json({
    message: COMMONS_MESSAGES.LOGIN_SUCCESS,
    result
  })
  return
}

export const oauthController = async (req: Request, res: Response) => {
  const { code } = req.query
  const result = await customersService.ouath(code as string)
  const urlRedirect = `${process.env.CLIENT_REDIRECT_CALLBACK as string}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&newUser=${result.newUser}&customer=${JSON.stringify(result.customer)}`
  res.redirect(urlRedirect)
  return
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  await customersService.logout(refresh_token)
  res.json({
    message: COMMONS_MESSAGES.LOGOUT_SUCCESS
  })
  return
}

export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const { customer_id } = req.decoded_authorization as TokenPayload
  const result = await customersService.getProfile(customer_id)
  res.json({
    message: CUSTOMERS_MESSAGES.GET_ME_SUCCESS,
    result
  })
  return
}

export const updatetProfileController = async (
  req: Request<ParamsDictionary, any, UpdateProfileRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.decoded_authorization as TokenPayload
  const { body } = req

  const result = await customersService.updateProfile(customer_id, body)
  res.json({
    message: CUSTOMERS_MESSAGES.UPDATE_ME_SUCCESS,
    result
  })
  return
}

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { customer_id } = req.decoded_authorization as TokenPayload
  const customer = await databaseService.customers.findOne({ _id: new ObjectId(customer_id) })
  if (!customer) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      message: CUSTOMERS_MESSAGES.CUSTOMER_NOT_FOUND
    })
    return
  }
  if (customer.verify === UserVerifyStatus.Verified) {
    res.json({
      message: CUSTOMERS_MESSAGES.EMAIL_ALREADY_VERIFED_BEFORE
    })
    return
  }
  await customersService.resendVerifyEmail(customer_id)
  res.json({
    message: CUSTOMERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
  })
  return
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.decoded_email_verify_token as TokenPayload
  const customer = await databaseService.customers.findOne({
    _id: new ObjectId(customer_id)
  })
  const { verify } = customer as Customer
  //Đã verify roi thì mình không báo lỗi
  if (verify === UserVerifyStatus.Unverified) {
    const result = await customersService.verifyEmail(customer_id)
    res.json({
      message: CUSTOMERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
      result
    })
    return
  }
  res.json({
    message: CUSTOMERS_MESSAGES.EMAIL_ALREADY_VERIFED_BEFORE
  })
  return
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id, verify, email } = req.customer as Customer
  await customersService.forgotPassword({
    customer_id: (_id as ObjectId).toString(),
    verify: verify,
    email
  })

  res.json({
    message: CUSTOMERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
  })
  return
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, verifyForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  res.json({
    message: CUSTOMERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
  return
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, resetPassword>,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.decoded_password_verify_token as TokenPayload
  const { password } = req.body
  await customersService.resetPassword(customer_id, password)
  res.json({
    message: CUSTOMERS_MESSAGES.RESET_PASSWORD_SUCCESS
  })
  return
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.decoded_authorization as TokenPayload
  const { new_password } = req.body
  await customersService.changePassword(customer_id, new_password)

  res.json({
    message: CUSTOMERS_MESSAGES.CHANGE_PASSWORD_SUCCESS
  })
  return
}

export const changeStatusCustomerController = async (
  req: Request<ParamsDictionary, any, ChangeStatusReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const { customer_id } = req.body
  const { status } = req.body
  await customersService.changeStatus({ user_id, customer_id, status })

  res.json({
    message: CUSTOMERS_MESSAGES.CHANGE_STATUS_SUCCESS
  })
}

export const exportFileCustomerController = async (req: Request, res: Response, next: NextFunction) => {
  const customer_ids = req.body.customer_ids as string[]
  console.log('customer_ids', customer_ids)
  const result = await customersService.exportFileCustomer({ customer_ids, res })
  res.json({
    message: CUSTOMERS_MESSAGES.EXPORT_FILE_CUSTOMER_SUCCESS,
    result
  })
}
