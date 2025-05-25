import { Media } from '../Other'

export interface ProductReqBody {
  category_id: string
  name: string
  description: string
  price: number
  stock: number
  color: string
  size: number
  url_images: Media[]
}

export interface UpdateProductReqBody {
  product_id: string
  name?: string
  description?: string
  price?: number
  url_images?: Media[]
}

export interface OptionProductReqBody {
  product_id: string
  size: number
  color: string
  stock: number
}

export interface OptionProductReqBody {
  product_id: string
  size: number
  color: string
  stock: number
}
export interface OptionProductUpdateReqBody {
  optionProduct_id: string
  product_id: string
  size: number
  color: string
  stock: number
}
