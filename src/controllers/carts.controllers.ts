import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CARTS_MESSAGES } from '~/constants/messages'
import { CartReqBody } from '~/models/requests/Cart.requests'
import { TokenPayload } from '~/models/requests/Customer.requests'
import cartsService from '~/services/carts.services'

export const getCartsByCustomerIdController = async (req: Request, res: Response, next: NextFunction) => {
  const { customer_id } = req.decoded_authorization as TokenPayload
  const { status } = req.query

  const result = await cartsService.getCartsByCustomerId({ customer_id, status: Number(status) })
  if (result.total === 0) {
    res.json({
      message: CARTS_MESSAGES.GET_CARTS_SUCCESS
    })
    return
  }
  res.json({
    message: CARTS_MESSAGES.GET_CARTS_SUCCESS,
    result: {
      carts: result.carts,
      total_cart: result.total
    }
  })
  return
}

export const addToCartController = async (
  req: Request<ParamsDictionary, any, CartReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.decoded_authorization as TokenPayload
  const result = await cartsService.addToCart({
    customer_id,
    payload: req.body
  })

  res.json({
    message: CARTS_MESSAGES.ADD_TO_CART_SUCCESS,
    result
  })
}

export const updateCartsController = async (
  req: Request<ParamsDictionary, any, CartReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.decoded_authorization as TokenPayload
  await cartsService.updateCart({
    customer_id,
    payload: req.body
  })
  res.json({
    message: CARTS_MESSAGES.UPDATE_CART_SUCCESS
  })
  return
}

export const deleteCartsByProductIdController = async (req: Request, res: Response, next: NextFunction) => {
  const { customer_id } = req.decoded_authorization as TokenPayload
  const result = await cartsService.deleteCart({ customer_id, product_ids: req.body })
  res.json({
    message: CARTS_MESSAGES.DELETE_CART_SUCCESS,
    result: result.deletedCount
  })
}

//Tạm thời bỏ
// export const buyProductsController = async (req: Request, res: Response, next: NextFunction) => {
//   const { customer_id } = req.decoded_authorization as TokenPayload
//   const result = await cartsService.buyProducts({ customer_id, payload: req.body })
//   res.json({
//     message: CARTS_MESSAGES.BUY_PRODUCT_SUCCESS
//   })
// }
