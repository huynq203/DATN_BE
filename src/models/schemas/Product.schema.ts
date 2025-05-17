import { ObjectId } from 'mongodb'
import { ProductStatus } from '~/constants/enums'
import { Media } from '../Other'
interface ProductType {
  _id?: ObjectId
  category_id: ObjectId // Danh mục
  name: string // Tên sản phẩm
  slug: string // Tên sản phẩm dạng slug (đã được chuyển đổi từ tên sản phẩm)
  description: string // Mô tả sản phẩm
  url_images?: Media[]
  price: number // Giá sản phẩm
  promotion_price?: number // Giá khuyến mãi
  sizes?: ObjectId[] // Kích thước sản phẩm
  colors?: ObjectId[] // Màu sắc sản phẩm
  status?: ProductStatus // Trạng thái sản phẩm (0: không hoạt động, 1: hoạt động)
  view?: number
  sold?: number // Số lượng đã bán của sản phẩm
  stock?: number // Số lượng hàng tồn kho
  created_by: ObjectId // Người tạo sản phẩm
  created_at?: Date
  updated_at?: Date
}

export default class Product {
  _id?: ObjectId
  category_id: ObjectId // Danh mục
  name: string // Tên sản phẩm
  description: string // Mô tả sản phẩm
  slug: string // Tên sản phẩm dạng slug (đã được chuyển đổi từ tên sản phẩm)
  url_images?: Media[]
  price: number // Giá sản phẩm
  promotion_price?: number // Giá khuyến mãi
  sizes?: ObjectId[] // Kích thước sản phẩm
  colors?: ObjectId[] // Màu sắc sản phẩm
  status: ProductStatus // Trạng thái sản phẩm (0: không hiển thị, 1: hiển thị)
  view: number // Số lượt xem của khách hàng
  sold: number // Số lượng đã bán của sản phẩm
  stock: number // Số lượng hàng tồn kho
  created_by: ObjectId // Người tạo sản phẩm
  created_at?: Date
  updated_at?: Date
  constructor(product: ProductType) {
    this._id = product._id || new ObjectId()
    this.category_id = product.category_id
    this.name = product.name
    this.slug = product.slug
    this.description = product.description
    this.url_images = product.url_images || []
    this.price = product.price
    this.promotion_price = product.promotion_price || 0
    this.sizes = product.sizes || []
    this.colors = product.colors || []
    this.status = product.status || ProductStatus.Active
    this.view = product.view || 0
    this.sold = product.sold || 0
    this.stock = product.stock || 0
    this.created_by = product.created_by
    this.created_at = product.created_at || new Date()
    this.updated_at = product.updated_at || new Date()
  }
}
