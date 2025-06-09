import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CATEGORIES_MESSAGES } from '~/constants/messages'
import { CategoryReqBody, UpdateCategoryReqBody } from '~/models/requests/Category.requests'
import { TokenPayload } from '~/models/requests/Customer.requests'
import categoriesService from '~/services/categories.services'

export const getAllCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await categoriesService.getAllCategories()
  res.json({
    message: CATEGORIES_MESSAGES.GET_CATEGORY_SUCCESS,
    result
  })
  return
}

export const getAllCategoriesManagerController = async (req: Request, res: Response, next: NextFunction) => {
  const key_search = req.query.key_search as string
  const result = await categoriesService.getAllCategoriesManager({ key_search })

  res.json({
    message: CATEGORIES_MESSAGES.GET_CATEGORY_SUCCESS,
    result
  })
}

export const getCategoryByIdController = async (req: Request, res: Response, next: NextFunction) => {
  const { category_id } = req.params
  const result = await categoriesService.getCategoryById(category_id)
  res.json({
    message: CATEGORIES_MESSAGES.GET_CATEGORY_BY_ID_SUCCESS,
    result
  })
  return
}

export const createCategoryController = async (
  req: Request<ParamsDictionary, any, CategoryReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  console.log(req.body)

  const result = await categoriesService.createCategory({ user_id, payload: req.body })
  res.json({
    message: CATEGORIES_MESSAGES.CREATE_SUCCESS,
    result
  })
  return
}

export const updateCategoryController = async (
  req: Request<ParamsDictionary, any, UpdateCategoryReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const result = await categoriesService.updateCategory({
    user_id,
    payload: req.body
  })

  res.json({
    message: CATEGORIES_MESSAGES.UPDATE_SUCCESS,
    result
  })
  return
}

export const deleteCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  const { category_id } = req.body
  await categoriesService.deleteCategory(category_id)
  res.json({
    message: CATEGORIES_MESSAGES.DELETE_SUCCESS
  })
  return
}
