import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ADDRESSES_MESSAGES } from '~/constants/messages'
import { CreateAddressReqBody } from '~/models/requests/Address.requests'

export const createAddressController = async (
  req: Request<ParamsDictionary, any, CreateAddressReqBody>,
  res: Response,
  next: NextFunction
) => {
  res.json({
    message: ADDRESSES_MESSAGES.CREATE_SUCCESS
  })
  return
}

export const updateAddressController = async (
  req: Request<ParamsDictionary, any, CreateAddressReqBody>,
  res: Response,
  next: NextFunction
) => {
  res.json({
    message: ADDRESSES_MESSAGES.UPDATE_SUCCESS
  })
  return
}

export const deleteAddressController = async (
  req: Request<ParamsDictionary, any, CreateAddressReqBody>,
  res: Response,
  next: NextFunction
) => {
  res.json({
    message: ADDRESSES_MESSAGES.DELETE_SUCCESS
  })
  return
}
