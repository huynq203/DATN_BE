import { Router } from 'express'
import {
  createColorController,
  createProductController,
  createSizeController,
  deleteProductController,
  getAllProductController,
  getProductByIdController,
  updateProductController,
  uploadImageProductController
} from '~/controllers/products.controllers'
import { accessTokenValidator, isLoggedInVaidator } from '~/middlewares/commons.middlewares'
import { createProductValidator, updateProductValidator } from '~/middlewares/products.middlewares'
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
productsRouter.get('/:product_id', wrapRequestHandler(getProductByIdController))

/**
 * Description: Create Product
 * Path: api/products/created
 * Method: GET
 * Body: {category_id,name:string,description:string,image_url?:string,price:number,created_by:string}
 * Header: {Authorization: Bearer <access_token>}
 */
productsRouter.post(
  '/create',
  accessTokenValidator,
  createProductValidator,
  wrapRequestHandler(createProductController)
)

//Update Product
productsRouter.patch(
  '/edit/:product_id',
  accessTokenValidator,
  updateProductValidator,
  wrapRequestHandler(updateProductController)
)

//Delete Product
productsRouter.delete('/delete/product_id', accessTokenValidator, wrapRequestHandler(deleteProductController))

//Upload file
productsRouter.post('/upload-image/:product_id', accessTokenValidator, wrapRequestHandler(uploadImageProductController))

//Create thêm size
productsRouter.post('/create-size/:product_id', accessTokenValidator, wrapRequestHandler(createSizeController))

//Create thêm color
productsRouter.post('/create-color/:product_id', accessTokenValidator, wrapRequestHandler(createColorController))

export default productsRouter
