import { Router } from 'express'
import {
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
 * Description: create order
 * Path: api/orders/
 * Method: POST
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
