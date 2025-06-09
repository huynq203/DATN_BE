import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { OrderReqBody, OrderReqQuery } from '~/models/requests/Order.requests'
import { config } from 'dotenv'
import { ORDERS_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/Customer.requests'
import ordersService from '~/services/orders.services'
import { VnPayStatus } from '~/constants/enums'

config()

export const getOrderByCustomerController = async (req: Request, res: Response, next: NextFunction) => {
  const { customer_id } = req.decoded_authorization as TokenPayload

  await ordersService.getOrderByCustomer(customer_id)
  res.json({
    message: ORDERS_MESSAGES.GET_ORDERS_SUCCESS
  })
  return
}

export const getOrderManager = async (req: Request, res: Response, next: NextFunction) => {
  const key_search = req.query.key_search as string
  const result = await ordersService.getOrderManager({ key_search })
  res.json({
    message: ORDERS_MESSAGES.GET_ORDERS_SUCCESS,
    result
  })
  return
}

export const orderCodController = async (
  req: Request<ParamsDictionary, any, OrderReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.decoded_authorization as TokenPayload
  const payload = req.body
  await ordersService.createOrderCOD({ customer_id, payload })
  res.json({
    message: ORDERS_MESSAGES.ORDER_SUCCESS,
    payment_method: payload.payment_method
  })
  return
}

export const orderMomoController = async (
  req: Request<ParamsDictionary, any, OrderReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.decoded_authorization as TokenPayload
  const payload = req.body
  // await ordersService.createOrderMomo({ customer_id, payload })
  res.json({
    message: ORDERS_MESSAGES.ORDER_SUCCESS
  })
  return
}

export const orderVnpayController = async (
  req: Request<ParamsDictionary, any, OrderReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.decoded_authorization as TokenPayload
  const payload = req.body
  const { ip } = req

  const paymentUrl = await ordersService.createOrderVnPay({ customer_id, payload, ip: ip as string })
  res.json({
    message: ORDERS_MESSAGES.ORDER_PENDING,
    paymentUrl
  })
}

export const orderVnPayReturnController = async (req: Request, res: Response, next: NextFunction) => {
  const searchParam = req.query as unknown as OrderReqQuery
  const { customer_id } = req.decoded_authorization as TokenPayload
  const result = await ordersService.returnOrderVnPay({ customer_id, payload: searchParam })
  if (result.check === true) {
    if (searchParam.vnp_ResponseCode === VnPayStatus.Success) {
      res.json({
        message: 'Thanh toán thành công',
        result: { ...searchParam, payment_method: result.payment_method }
      })
    } else {
      res.json({ message: 'Thanh toán thất bại', result: { ...searchParam, payment_method: result.payment_method } })
    }
  } else {
    res.json({ message: 'Dữ liệu không hợp lệ', result: searchParam })
  }
}
