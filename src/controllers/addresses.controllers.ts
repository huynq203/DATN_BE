import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ADDRESSES_MESSAGES } from '~/constants/messages'
import { CreateAddressReqBody, UpdateAddressReqBody } from '~/models/requests/Address.requests'
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
export const getAddressByCustomerController = async (req: Request, res: Response, next: NextFunction) => {
  const { customer_id } = req.decoded_authorization as TokenPayload
  const result = await addressesService.getAddressbyCustomer(customer_id)
  res.json({
    message: ADDRESSES_MESSAGES.GET_ADDRESS_SUCCESS,
    result
  })
}

export const getAddressCustomerManagerController = async (req: Request, res: Response, next: NextFunction) => {
  const { customer_id } = req.params
  const result = await addressesService.getAddressbyCustomer(customer_id)
  res.json({
    message: ADDRESSES_MESSAGES.GET_ADDRESS_SUCCESS,
    result
  })
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
  req: Request<ParamsDictionary, any, UpdateAddressReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await addressesService.updateAddress(req.body)
  res.json({
    message: ADDRESSES_MESSAGES.UPDATE_SUCCESS,
    result
  })
  return
}

export const deleteAddressController = async (req: Request, res: Response, next: NextFunction) => {
  const { address_id } = req.body
  await addressesService.deleteAddressController(address_id)
  res.json({
    message: ADDRESSES_MESSAGES.DELETE_SUCCESS
  })
  return
}

export const setAddressDefaultController = async (req: Request, res: Response, next: NextFunction) => {
  const { address_id } = req.body
  const { customer_id } = req.decoded_authorization as TokenPayload
  await addressesService.setDefaultAddress({ customer_id, address_id })

  res.json({
    message: ADDRESSES_MESSAGES.UPDATE_ADDRESS_DEFAULT_SUCCESS
  })
  return
}
