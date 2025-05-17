import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { MEDIA_MESSAGES, PRODUCTS_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/Customer.requests'
import { ProductReqBody } from '~/models/requests/Product.requests'
import productsService from '~/services/products.services'

export const getAllProductController = async (req: Request, res: Response, next: NextFunction) => {
  const limit = Number(req.query.limit) || 10
  const page = Number(req.query.page) || 1
  const sort_by = (req.query.sort_by as string) || 'created_at'
  const order = Number(req.query.order) || -1
  const rating_filter = Number(req.query.rating_filter)
  const price_max = Number(req.query.price_max) || 99999999
  const price_min = Number(req.query.price_min) || 1
  const name = req.query.name as string
  const category_id = req.query.category_id as string

  const data = await productsService.getAllProducts({
    limit: limit,
    page: page,
    sort_by,
    order,
    category_id,
    price_min,
    price_max,
    name
  })
  res.json({
    message: PRODUCTS_MESSAGES.GET_PRODUCT_SUCCESS,
    result: {
      products: data.products,
      paginate: {
        limit,
        page,
        total_page: Math.ceil(data.total / limit)
      }
    }
  })
  return
}

export const getProductByIdController = async (req: Request, res: Response, next: NextFunction) => {
  const { product_id } = req.params
  const result = await productsService.getProductById(product_id)
  res.json({
    message: PRODUCTS_MESSAGES.GET_PRODUCT_SUCCESS,
    result
  })
  return
}

export const createProductController = async (
  req: Request<ParamsDictionary, any, ProductReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const result = await productsService.createProducts({
    user_id,
    payload: req.body
  })

  res.json({
    message: PRODUCTS_MESSAGES.CREATE_PRODUCT_SUCCESS
    // result
  })
  return
}

export const updateProductController = async (
  req: Request<ParamsDictionary, any, ProductReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { product_id } = req.params

  const result = await productsService.updateProducts({
    user_id,
    product_id,
    payload: req.body
  })
  res.json({
    message: PRODUCTS_MESSAGES.UPDATE_SUCCESS,
    result
  })
  return
}

export const deleteProductController = async (req: Request, res: Response, next: NextFunction) => {
  const { product_id } = req.params
  await productsService.deleteProducts(product_id)
  res.json({
    message: PRODUCTS_MESSAGES.DELETE_SUCCESS
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

export const createSizeController = async (
  req: Request<ParamsDictionary, any, ProductReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { product_id } = req.params
  const { size } = req.body
  const result = await productsService.createSize({ user_id, product_id, size })

  res.json({
    message: PRODUCTS_MESSAGES.CREATE_SIZE_SUCCESS,
    result
  })
  return
}

export const createColorController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { product_id } = req.params
  const { color } = req.body
  const result = await productsService.createColor({ user_id, product_id, color })

  res.json({
    message: PRODUCTS_MESSAGES.CREATE_COLOR_SUCCESS,
    result
  })
  return
}
