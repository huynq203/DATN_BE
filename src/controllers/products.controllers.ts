import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { MEDIA_MESSAGES, PRODUCTS_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/Customer.requests'
import { ProductReqBody } from '~/models/requests/Product.requests'
import productsService from '~/services/products.services'

export const getAllProductController = async (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: PRODUCTS_MESSAGES.GET_PRODUCT_SUCCESS
  })
  return
}

export const getProductByIdController = async (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: PRODUCTS_MESSAGES.GET_PRODUCT_SUCCESS
  })
  return
}

export const createProductController = async (
  req: Request<ParamsDictionary, any, ProductReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  console.log(user_id)
  console.log(req.body)

  const result = await productsService.createProducts({
    user_id,
    payload: req.body
  })

  res.json({
    message: PRODUCTS_MESSAGES.CREATE_PRODUCT_SUCCESS,
    result
  })
  return
}

export const updateProductController = async (
  req: Request<ParamsDictionary, any, ProductReqBody>,
  res: Response,
  next: NextFunction
) => {
  console.log(req)

  res.json({
    message: MEDIA_MESSAGES.UPLOAD_SUCCESS
  })
  return
}

export const deleteProductController = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req)

  res.json({
    message: MEDIA_MESSAGES.UPLOAD_SUCCESS
  })
  return
}

export const uploadImageProductController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { product_id } = req.params
  const result = await productsService.uploadImageProduct({ user_id, product_id, req })

  res.json({
    message: MEDIA_MESSAGES.UPLOAD_SUCCESS,
    result
  })
  return
}
