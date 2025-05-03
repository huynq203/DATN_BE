import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CATEGORIES_MESSAGES } from '~/constants/messages'
import { CategoryReqBody, UpdateCategoryReqBody } from '~/models/requests/Category.requests'
import { TokenPayload } from '~/models/requests/Customer.requests'
import categoriesService from '~/services/categories.services'

export const getAllCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const data = await categoriesService.getAllCategories({
    limit,
    page
  })
  res.json({
    message: CATEGORIES_MESSAGES.GET_CATEGORY_SUCCESS,
    result: {
      categories: data.categories,
      pagination: {
        page,
        limit,
        total_page: Math.ceil(data.total / limit)
      }
    }
  })
  return
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
  const result = await categoriesService.createCategory(req.body)
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
  const { product_id } = req.params
  const result = await categoriesService.updateCategory({
    user_id,
    product_id,
    payload: req.body
  })

  res.json({
    message: CATEGORIES_MESSAGES.UPDATE_SUCCESS,
    result
  })
  return
}

export const deleteCategoryController = async (
  req: Request<ParamsDictionary, any, CategoryReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { product_id } = req.params
  await categoriesService.deleteCategory(product_id)
  res.json({
    message: CATEGORIES_MESSAGES.DELETE_SUCCESS
  })
  return
}
