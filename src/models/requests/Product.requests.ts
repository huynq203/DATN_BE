import { Media } from '../Other'

export interface ProductReqBody {
  category_id: string
  name: string
  description: string
  price: number
  gender: number
  target_person: number
  // stock: number
  // url_images: Media
  // color: string
  // size: number
  url_images: Media[]
}

export interface UpdateProductReqBody {
  product_id: string
  name?: string
  description?: string
  price?: number
  promotion_price?: number
  gender?: number
  target_person?: number
  url_images?: Media[]
}

export interface OptionProductReqBody {
  product_id: string
  size: number
  color: string
  stock: number
  cost_price?: number
  image_variant_color: Media
}

export interface OptionProductUpdateReqBody {
  optionProduct_id: string
  product_id: string
  size: number
  color: string
  image_variant_color: Media
}

export interface ChangeStatusProduct {
  product_id: string
  status: number
}

export interface ChangeStatusOptionProduct {
  option_product_id: string
  status: number
}

export interface CreatePurchaseReq {
  option_product_id: string
  product_id: string
  stock: number
  cost_price: number
}
