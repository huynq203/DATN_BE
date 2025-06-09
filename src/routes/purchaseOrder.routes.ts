import { Router } from 'express'

import { createPurchaseController, deletePurchaseController } from '~/controllers/purchaseOder.controllers'
import { accessTokenValidator } from '~/middlewares/commons.middlewares'
import { wrapRequestHandler } from '~/utils/hanlders'
const purchaseOrderRouter = Router()

/**
 * Description: get all products
 * Path: api/purchase-orders/create
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body:[{option_product_id:string, product_id:string, stock:number,cost_price:number}]
 */
purchaseOrderRouter.post('/create', accessTokenValidator, wrapRequestHandler(createPurchaseController))

/**
 * Description: get all products
 * Path: api/purchase-orders/delete
 * Method: DELETE
 * Header: {Authorization: Bearer <access_token>}
 * Body:{purchase_order_id:string}
 */
purchaseOrderRouter.delete('/delete', accessTokenValidator, wrapRequestHandler(deletePurchaseController))

export default purchaseOrderRouter
