import Router from 'express'
import {
  addToCartController,
  deleteCartsByProductIdController,
  getCartsByCustomerIdController,
  updateCartsController
} from '~/controllers/carts.controllers'
import { accessTokenValidator } from '~/middlewares/commons.middlewares'
import { verifiedCustomerValidator } from '~/middlewares/customers.middlewares'
const cartsRouter = Router()

/**
 * Description: get cart by customer_id
 * Path: api/carts/
 * Method: GET
 * Header: {Authorization: Bearer <access_token>}
 */
cartsRouter.get('/', accessTokenValidator, getCartsByCustomerIdController)

/**
 * Description: add to cart
 * Path: api/carts/add-to-cart
 * Method: POST
 * Body: {product_id:string,quantity:number,size:string}
 * Header: {Authorization: Bearer <access_token>}
 */
cartsRouter.post('/add-to-cart', accessTokenValidator, addToCartController)

/**
 * Description: Update product to cart
 * Path: api/carts/update-product
 * Method: PUT
 * Body: {product_id:string,quantity:number,size:string}
 * Header: {Authorization: Bearer <access_token>}
 */
cartsRouter.put('/update-product', accessTokenValidator, updateCartsController)

/**
 * Description: Update product to cart
 * Path: api/carts/:product_id
 * Method: DELETE
 * Body: {product_id:string,quantity:number,size:string}
 * Header: {Authorization: Bearer <access_token>}
 */
cartsRouter.delete('/', accessTokenValidator, deleteCartsByProductIdController)

/**
 * Description: Buy product to cart
 * Path: api/carts/update-product
 * Method: POST
 * Body: [{product_id:string,quantity:number,size:string}]
 * Header: {Authorization: Bearer <access_token>}
 */
//Tạm thời bỏ
// cartsRouter.post('/buy-products', accessTokenValidator, buyProductsController)

export default cartsRouter
