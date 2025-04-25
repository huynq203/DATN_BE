import { ObjectId } from 'mongodb'
import { ProductStatus } from '~/constants/enums'

export interface ProductReqBody {
  category_id: string
  name: string
  description: string
  detail: string // Chi tiết sản phẩm
  url_images?: string[]
  price: number
  created_by: ObjectId
}
