import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import dotenv from 'dotenv'
import { COMMONS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import {
  CreateUserReqBody,
  LoginUserReqBody,
  LogoutUserResBody,
  UpdateUserReqBody
} from '~/models/requests/User.requests'
import usersService from '~/services/users.services'
import User from '~/models/schemas/User.schemas'
import { ObjectId } from 'mongodb'
import { TokenPayload } from '~/models/requests/Customer.requests'
dotenv.config()

export const loginUserController = async (
  req: Request<ParamsDictionary, any, LoginUserReqBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const role = user.role as ObjectId
  const result = await usersService.loginUser({ user_id: user_id.toString(), role: role.toString() })
  res.json({
    message: COMMONS_MESSAGES.LOGIN_SUCCESS,
    result
  })
  return
}

export const logoutUserController = async (
  req: Request<ParamsDictionary, any, LogoutUserResBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  await usersService.logoutUser(refresh_token)
  res.json({
    message: COMMONS_MESSAGES.LOGOUT_SUCCESS
  })
  return
}

export const getMeUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await usersService.getMeUser(user_id)
  res.json(result)
  return
}

export const createUserController = async (
  req: Request<ParamsDictionary, any, CreateUserReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.createUser(req.body)

  res.json({
    message: USERS_MESSAGES.CREATE_SUCCESS,
    result
  })
  return
}

export const updateUserController = async (
  req: Request<ParamsDictionary, any, UpdateUserReqBody>,
  res: Response,
  next: NextFunction
) => {
  res.json({
    message: USERS_MESSAGES.UPDATE_PROFILE_SUCCESS
  })
  return
}
