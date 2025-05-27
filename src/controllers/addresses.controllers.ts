import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ADDRESSES_MESSAGES } from '~/constants/messages'
import { CreateAddressReqBody } from '~/models/requests/Address.requests'
import { TokenPayload } from '~/models/requests/Customer.requests'
import addressesService from '~/services/addresses.services'

export const getAllAddressController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await addressesService.getAllAddress()
  res.json({
    message: ADDRESSES_MESSAGES.GET_ADDRESS_SUCCESS,
    result
  })
  return
}
export const getAddressByCustomer = async (req: Request, res: Response, next: NextFunction) => {
  const { customer_id } = req.params
  const result = await addressesService.getAddressbyCustomer(customer_id)
  res.json({
    message: ADDRESSES_MESSAGES.GET_ADDRESS_SUCCESS,
    result
  })
}

export const getAddressCustomerManager = async (req: Request, res: Response, next: NextFunction) => {
  const { customer_id } = req.params
  console.log(customer_id)
}

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


