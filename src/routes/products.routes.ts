import { Router } from 'express'
import {
  changeStatusOptionProductController,
  changeStatusProductController,
  createOptionProductController,
  createProductController,
  deleteOptionProductController,
  deleteProductController,
  exportFileProductController,
  getAllProductController,
  getAllProductManagerController,
  getAllStockOptionProductManagerByIdController,
  getOptionProductController,
  getProductByIdController,
  updateOptionProductController,
  updateProductController,
  uploadImageProductController,
  uploadImageVariantColorController
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
 * Description: get all products
 * Path: api/products/
 * Method: GET
 */
productsRouter.get('/manager', wrapRequestHandler(getAllProductManagerController))

/**
 * Description: export file Product
 * Path: api/products/export-file
 * Method: GET
 */
productsRouter.post('/export-file', accessTokenValidator, wrapRequestHandler(exportFileProductController))

/**
 * Description: get Stock Products for Manager
 * Path: api/products/check-stock-option-product
 * Method: GET
 */
productsRouter.get(
  '/check-stock-option-product/:option_product_id',
  wrapRequestHandler(getAllStockOptionProductManagerByIdController)
)

/**
 * Description: GET Option Products by product_id
 * Path: api/products/get-option-products/:product_id
 * Method: GET
 * Body: {product_id:string}
 * Header: {Authorization: Bearer <access_token>}
 */
productsRouter.get('/get-option-products/:product_id', wrapRequestHandler(getOptionProductController))

/**
 * Description: get product by id
 * Path: api/products/:product_id
 * Method: GET
 * Body: {product_id:string}
 */
productsRouter.get('/:product_id', wrapRequestHandler(getProductByIdController))

/**
 * Description: Create Product
 * Path: api/products/create
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

/**
 * Description: Update Product
 * Path: api/products/update
 * Method: POST
 * Body: {category_id,name:string,description:string,image_url?:string,price:number,created_by:string}
 * Header: {Authorization: Bearer <access_token>}
 */
productsRouter.put('/update', accessTokenValidator, updateProductValidator, wrapRequestHandler(updateProductController))

/**
 * Description: Update Product
 * Path: api/products/delete
 * Method: DELETE
 * Body: {product_id:string}
 * Header: {Authorization: Bearer <access_token>}
 */
productsRouter.delete('/delete', accessTokenValidator, wrapRequestHandler(deleteProductController))

/**
 * Description: Upload Image Product
 * Path: api/products/upload-image
 * Method: POST
 * Body: rest of the body is form-data with key 'file' and value is the image file
 * Header: {Authorization: Bearer <access_token>}
 */
productsRouter.post('/upload-image', accessTokenValidator, wrapRequestHandler(uploadImageProductController))

/**
 * Description: Upload Image Variant Color Product
 * Path: api/products/upload-image
 * Method: POST
 * Body: rest of the body is form-data with key 'file' and value is the image file
 * Header: {Authorization: Bearer <access_token>}
 */
productsRouter.post(
  '/upload-image-variant-color',
  accessTokenValidator,
  wrapRequestHandler(uploadImageVariantColorController)
)

/**
 * Description: Create Option Products by product_id
 * Path: api/products/create-option-products
 * Method: POST
 * Body: {product_id:string, stock:number, sizes:number, colors:string}
 * Header: {Authorization: Bearer <access_token>}
 */
productsRouter.post('/create-option-product', accessTokenValidator, wrapRequestHandler(createOptionProductController))

/**
 * Description: Update Option Products by product_id
 * Path: api/products/update-option-products
 * Method: POST
 * Body: {product_id:string, stock:number, sizes:number, colors:string}
 * Header: {Authorization: Bearer <access_token>}
 */
productsRouter.put('/update-option-product', accessTokenValidator, wrapRequestHandler(updateOptionProductController))

/**
 * Description: Delete Option Products by product_id
 * Path: api/products/delete-option-products
 * Method: POST
 * Body: {option_product_id:string}
 * Header: {Authorization: Bearer <access_token>}
 */
productsRouter.delete('/delete-option-product', accessTokenValidator, wrapRequestHandler(deleteOptionProductController))

/**
 * Description: Cập nhật trạng thái sản phẩm
 * Path: api/products/change-status
 * Method: POST
 * Body: {option_product_id:string}
 * Header: {Authorization: Bearer <access_token>}
 */
productsRouter.patch('/change-status', accessTokenValidator, wrapRequestHandler(changeStatusProductController))

/**
 * Description: Cập nhật trạng thái sản phẩm thuộc tính
 * Path: api/products/change-status
 * Method: POST
 * Body: {option_product_id:string}
 * Header: {Authorization: Bearer <access_token>}
 */
productsRouter.patch(
  '/change-status-option-product',
  accessTokenValidator,
  wrapRequestHandler(changeStatusOptionProductController)
)



export default productsRouter
