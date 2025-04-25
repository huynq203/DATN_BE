import { Router } from 'express'
import { createCategoryController } from '~/controllers/categories.controllers'
import { createCategoryValidator } from '~/middlewares/categories.middlewares'
import { accessTokenValidator } from '~/middlewares/commons.middlewares'
import { wrapRequestHandler } from '~/utils/hanlders'
const categoriesRouter = Router()

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
categoriesRouter.put(
  '/update',
  accessTokenValidator,
  createCategoryValidator,
  wrapRequestHandler(createCategoryController)
)

export default categoriesRouter
