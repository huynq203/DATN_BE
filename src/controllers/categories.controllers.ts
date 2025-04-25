import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CATEGORIES_MESSAGES } from '~/constants/messages'
import { CategoryReqBody } from '~/models/requests/Category.requests'
import categoriesService from '~/services/categories.services'

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
