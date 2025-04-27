import { ObjectId } from 'mongodb'
import { ProductStatus } from '~/constants/enums'
import { Media } from '../Other'

export interface ProductReqBody {
  category_id: string
  name: string
  description: string
  price: number
}

export interface UpdateProductReqBody {
  name?: string
  description?: string
  price?: number
}
