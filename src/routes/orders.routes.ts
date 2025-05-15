import { Router } from 'express'
import {
  orderCodController,
  orderMomoController,
  orderVnpayController,
  orderVnPayReturnController
} from '~/controllers/orders.controllers'
import { accessTokenValidator } from '~/middlewares/commons.middlewares'
import { wrapRequestHandler } from '~/utils/hanlders'

const ordersRouter = Router()

/**
 * Description: create order
 * Path: api/orders/
 * Method: POST
 */
ordersRouter.post('/create-order-cod', accessTokenValidator, wrapRequestHandler(orderCodController))

ordersRouter.post('/create-order-momo', accessTokenValidator, wrapRequestHandler(orderMomoController))

ordersRouter.post('/create-order-vnpay', accessTokenValidator, wrapRequestHandler(orderVnpayController))

ordersRouter.get('/return-vnpay', accessTokenValidator, wrapRequestHandler(orderVnPayReturnController))

export default ordersRouter
