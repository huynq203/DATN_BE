import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { PRODUCTS_MESSAGES, PURCHASE_ORDER_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/Customer.requests'
import { CreatePurchaseReq } from '~/models/requests/Product.requests'
import purchaseOrdersService from '~/services/purchaseOrder.services'

export const createPurchaseController = async (
  req: Request<ParamsDictionary, any, CreatePurchaseReq[]>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  await purchaseOrdersService.createPurchaseOrder({
    user_id,
    payload: req.body
  })

  res.json({
    message: PURCHASE_ORDER_MESSAGES.CREATE_PURCHASE_ORDER_SUCCESS
  })
  return
}

export const deletePurchaseController = async (req: Request, res: Response, next: NextFunction) => {
  const { purchase_order_id } = req.body
  await purchaseOrdersService.deletePurchaseOrder({ purchase_order_id })

  res.json({
    message: PURCHASE_ORDER_MESSAGES.DELETE_PURCHASE_ORDER_SUCCESS
  })
  return
}
