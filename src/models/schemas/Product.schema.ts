import { ObjectId } from 'mongodb'
import { ProductStatus } from '~/constants/enums'
interface ProductType {
  _id?: ObjectId
  category_id: ObjectId // Danh mục
  name: string // Tên sản phẩm
  slug: string // Tên sản phẩm dạng slug (đã được chuyển đổi từ tên sản phẩm)
  description: string // Mô tả sản phẩm
  detail: string // Chi tiết sản phẩm
  url_images?: string[]
  price: number // Giá sản phẩm
  promotion_price?: number // Giá khuyến mãi
  status: ProductStatus // Trạng thái sản phẩm (0: không hoạt động, 1: hoạt động)
  created_by: ObjectId // Người tạo sản phẩm
  created_at?: Date
  updated_at?: Date
}

export default class Product {
  _id?: ObjectId
  category_id: ObjectId // Danh mục
  name: string // Tên sản phẩm
  description: string // Mô tả sản phẩm
  detail: string // Chi tiết sản phẩm
  slug: string // Tên sản phẩm dạng slug (đã được chuyển đổi từ tên sản phẩm)
  url_images?: string[]
  price: number // Giá sản phẩm
  promotion_price?: number // Giá khuyến mãi
  status: ProductStatus // Trạng thái sản phẩm (0: không hoạt động, 1: hoạt động)
  created_by: ObjectId // Người tạo sản phẩm
  created_at?: Date
  updated_at?: Date
  constructor(product: ProductType) {
    this._id = product._id || new ObjectId()
    this.category_id = product.category_id
    this.name = product.name
    this.slug = product.slug
    this.description = product.description
    this.detail = product.detail
    this.url_images = product.url_images || []
    this.price = product.price
    this.promotion_price = product.promotion_price || 0
    this.status = product.status || ProductStatus.Inactive
    this.created_by = product.created_by
    this.created_at = product.created_at || new Date()
    this.updated_at = product.updated_at || new Date()
  }
}
