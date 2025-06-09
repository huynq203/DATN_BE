import { Router } from 'express'
import {
  getOrderByCustomerController,
  getOrderManager,
  orderCodController,
  orderMomoController,
  orderVnpayController,
  orderVnPayReturnController
} from '~/controllers/orders.controllers'
import { accessTokenValidator } from '~/middlewares/commons.middlewares'
import { verifiedCustomerValidator } from '~/middlewares/customers.middlewares'
import { wrapRequestHandler } from '~/utils/hanlders'
const ordersRouter = Router()

/**
 * Description: Get Order By User
 * Path: api/orders/get-order-by-user
 * Method: GET
 * Header: {Authorization: Bearer <access_token>}
 */
ordersRouter.get(
  '/get-order-by-customer',
  accessTokenValidator,
  verifiedCustomerValidator,
  wrapRequestHandler(getOrderByCustomerController)
)

/**
 * Description: Get Order By User
 * Path: api/orders/get-order-by-user
 * Method: GET
 * Header: {Authorization: Bearer <access_token>}
 */
ordersRouter.get(
  '/get-order-manager',
  accessTokenValidator,
  wrapRequestHandler(getOrderManager)
)

/**
 * Description: create order cod
 * Path: api/orders/create-order-cod
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 */
ordersRouter.post(
  '/create-order-cod',
  accessTokenValidator,
  verifiedCustomerValidator,
  wrapRequestHandler(orderCodController)
)

ordersRouter.post(
  '/create-order-momo',
  accessTokenValidator,
  verifiedCustomerValidator,
  wrapRequestHandler(orderMomoController)
)

ordersRouter.post(
  '/create-order-vnpay',
  accessTokenValidator,
  verifiedCustomerValidator,
  wrapRequestHandler(orderVnpayController)
)

ordersRouter.get(
  '/return-vnpay',
  accessTokenValidator,
  verifiedCustomerValidator,
  wrapRequestHandler(orderVnPayReturnController)
)

export default ordersRouter
