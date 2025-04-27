import { Router } from 'express'
import {
  createProductController,
  deleteProductController,
  getAllProductController,
  getProductByIdController,
  updateProductController,
  uploadImageProductController
} from '~/controllers/products.controllers'
import { accessTokenValidator, isLoggedInVaidator } from '~/middlewares/commons.middlewares'
import { wrapRequestHandler } from '~/utils/hanlders'
const productsRouter = Router()

/**
 * Description: get all products
 * Path: api/products/
 * Method: GET
 */
productsRouter.get('/', wrapRequestHandler(getAllProductController))

/**
 * Description: get product by id
 * Path: api/products/:product_id
 * Method: GET
 * Body: {product_id:string}
 */
productsRouter.get(
  '/:product_id',
  isLoggedInVaidator(accessTokenValidator),
  wrapRequestHandler(getProductByIdController)
)

/**
 * Description: Create Product
 * Path: api/products/created
 * Method: GET
 * Body: {category_id,name:string,description:string,image_url?:string,price:number,created_by:string}
 * Header: {Authorization: Bearer <access_token>}
 */
productsRouter.post('/create', accessTokenValidator, wrapRequestHandler(createProductController))

//Update Product
productsRouter.patch('/update', accessTokenValidator, wrapRequestHandler(updateProductController))

//Delete Product
productsRouter.delete('/delete', accessTokenValidator, wrapRequestHandler(deleteProductController))

//Upload file
productsRouter.post('/upload-image/:product_id', accessTokenValidator, wrapRequestHandler(uploadImageProductController))
export default productsRouter
