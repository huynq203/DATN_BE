import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { MEDIA_MESSAGES, PRODUCTS_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/Customer.requests'
import {
  ChangeStatusOptionProduct,
  ChangeStatusProduct,
  OptionProductReqBody,
  OptionProductUpdateReqBody,
  ProductReqBody,
  UpdateProductReqBody
} from '~/models/requests/Product.requests'
import productsService from '~/services/products.services'

export const getAllProductController = async (req: Request, res: Response, next: NextFunction) => {
  const limit = Number(req.query.limit) || 10
  const page = Number(req.query.page) || 1
  const sort_by = (req.query.sort_by as string) || 'created_at'
  const order = Number(req.query.order) || -1
  const rating_filter = Number(req.query.rating_filter)
  const price_max = Number(req.query.price_max) || 99999999
  const price_min = Number(req.query.price_min) || 1
  const key_search = req.query.key_search as string
  const category_id = req.query.category_id as string
  const gender = Number(req.query.gender)
  const target_person = Number(req.query.target_person)

  const data = await productsService.getAllProducts({
    limit: limit,
    page: page,
    sort_by,
    order,
    category_id,
    price_min,
    price_max,
    key_search,
    gender,
    target_person
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
    result: {
      product: result.product,
      inventories: result.inventories
    }
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
    message: PRODUCTS_MESSAGES.CREATE_PRODUCT_SUCCESS,
    result
  })
  return
}

export const updateProductController = async (
  req: Request<ParamsDictionary, any, UpdateProductReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const result = await productsService.updateProducts({
    user_id,
    payload: req.body
  })
  res.json({
    message: PRODUCTS_MESSAGES.UPDATE_SUCCESS,
    result
  })
  return
}

export const deleteProductController = async (req: Request, res: Response, next: NextFunction) => {
  const { product_id } = req.body

  await productsService.deleteProducts(product_id)
  res.json({
    message: PRODUCTS_MESSAGES.DELETE_SUCCESS
  })
  return
}

export const uploadImageProductController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await productsService.uploadImageProduct({ req })
  res.json({
    message: MEDIA_MESSAGES.UPLOAD_SUCCESS,
    result
  })
}

export const uploadImageVariantColorController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await productsService.uploadImageVariantColor({ req })
  res.json({
    message: MEDIA_MESSAGES.UPLOAD_SUCCESS,
    result
  })
}

export const getAllProductManagerController = async (req: Request, res: Response, next: NextFunction) => {
  const key_search = req.query.key_search as string
  const category_id = req.query.category_id as string
  const status = req.query.status as string
  const gender = req.query.gender as string
  const target_person = req.query.target_person as string
  const price_min = Number(req.query.price_min)
  const price_max = Number(req.query.price_max)

  const result = await productsService.getAllProductManager({
    key_search,
    category_id,
    status,
    gender,
    target_person,
    price_min,
    price_max
  })
  res.json({
    message: PRODUCTS_MESSAGES.GET_PRODUCT_SUCCESS,
    result
  })
}

export const getAllStockOptionProductManagerByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { option_product_id } = req.params
  const result = await productsService.getAllStockOptionProductManagerById(option_product_id)
  res.json({
    message: PRODUCTS_MESSAGES.GET_PRODUCT_CHECK_STOCK_SUCCESS,
    result: {
      totalStock: result.totalStock,
      totalSold: result.totalSold,
      inventories: result.inventories
    }
  })
}

export const getOptionProductController = async (req: Request, res: Response, next: NextFunction) => {
  const { product_id } = req.params
  const result = await productsService.getOptionProduct(product_id)
  res.json({
    message: PRODUCTS_MESSAGES.GET_OPTION_PRODUCT_SUCCESS,
    result
  })
}

export const createOptionProductController = async (
  req: Request<ParamsDictionary, any, OptionProductReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await productsService.createOptionProduct({ user_id, payload: req.body })
  res.json({
    message: PRODUCTS_MESSAGES.CREATE_OPTION_PRODUCT_SUCCESS,
    result
  })
}

export const updateOptionProductController = async (
  req: Request<ParamsDictionary, any, OptionProductUpdateReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await productsService.updateOptionProduct({ user_id, payload: req.body })
  res.json({
    message: PRODUCTS_MESSAGES.UPDATE_OPTION_PRODUCT_SUCCESS,
    result
  })
}

export const deleteOptionProductController = async (req: Request, res: Response, next: NextFunction) => {
  const { optionProduct_id } = req.body
  await productsService.deleteOptionProduct(optionProduct_id)
  res.json({
    message: PRODUCTS_MESSAGES.DELETE_OPTION_PRODUCT_SUCCESS
  })
}

export const exportFileProductController = async (req: Request, res: Response, next: NextFunction) => {
  const product_ids = req.body.product_ids as string[]

  const result = await productsService.exportFile({ product_ids, res })
  res.json({
    message: PRODUCTS_MESSAGES.EXPORT_FILE_SUCCESS,
    result
  })
}

export const changeStatusProductController = async (
  req: Request<ParamsDictionary, any, ChangeStatusProduct>,
  res: Response,
  next: NextFunction
) => {
  await productsService.changeStatusProduct(req.body)

  res.json({
    message: PRODUCTS_MESSAGES.CHANGE_STATUS_PRODUCT_SUCCESS
  })
}

export const changeStatusOptionProductController = async (
  req: Request<ParamsDictionary, any, ChangeStatusOptionProduct>,
  res: Response,
  next: NextFunction
) => {
  await productsService.changeStatusOptionProduct(req.body)

  res.json({
    message: PRODUCTS_MESSAGES.CHANGE_STATUS_PRODUCT_SUCCESS
  })
}
