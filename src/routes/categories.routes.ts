import { Router } from 'express'
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController
} from '~/controllers/categories.controllers'
import { createCategoryValidator, updateCategoryValidator } from '~/middlewares/categories.middlewares'
import { accessTokenValidator } from '~/middlewares/commons.middlewares'
import { wrapRequestHandler } from '~/utils/hanlders'
const categoriesRouter = Router()

/**
 * Description: GET Category
 * Path: api/categories/
 * Method: GET
 */
categoriesRouter.get('/', wrapRequestHandler(getAllCategoriesController))

/**
 * Description: GET Category By ID
 * Path: api/categories/:category_id
 * Method: GET
 */
categoriesRouter.get('/:category_id', wrapRequestHandler(getCategoryByIdController))

/**
 * Description: Create Category
 * Path: api/categories/create
 * Method: POST
 * Body: {name:string,description:string}
 * Header: {Authorization: Bearer <access_token>}
 */
categoriesRouter.post(
  '/create',
  accessTokenValidator,
  createCategoryValidator,
  wrapRequestHandler(createCategoryController)
)

/**
 * Description: Create Category
 * Path: api/categories/create
 * Method: POST
 * Body: {name:string,description:string}
 * Header: {Authorization: Bearer <access_token>}
 */
categoriesRouter.patch(
  '/update/:product_id',
  accessTokenValidator,
  updateCategoryValidator,
  wrapRequestHandler(updateCategoryController)
)

/**
 * Description: Delete Category
 * Path: api/categories/delete
 * Method: DELETE
 * Body: {_id:string,name:string,description:string,created_by}
 * Header: {Authorization: Bearer <access_token>}
 */
categoriesRouter.delete('/delete/:product_id', accessTokenValidator, wrapRequestHandler(deleteCategoryController))

export default categoriesRouter
