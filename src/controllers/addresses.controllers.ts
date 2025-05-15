import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ADDRESSES_MESSAGES } from '~/constants/messages'
import { CreateAddressReqBody } from '~/models/requests/Address.requests'
import { TokenPayload } from '~/models/requests/Customer.requests'
import addressesService from '~/services/addresses.services'

export const createAddressController = async (
  req: Request<ParamsDictionary, any, CreateAddressReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.decoded_authorization as TokenPayload
  const result = await addressesService.createAddress({ customer_id, payload: req.body })

  res.json({
    message: ADDRESSES_MESSAGES.CREATE_SUCCESS,
    result
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
