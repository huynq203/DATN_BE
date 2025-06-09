import { ObjectId } from 'mongodb'
import { GenderType, StatusType, TargetType } from '~/constants/enums'
import { Media } from '../Other'
interface ProductType {
  _id?: ObjectId
  code_product: string // Mã sản phẩm (có thể là mã vạch hoặc mã định danh duy nhất)
  category_id: ObjectId // Danh mục
  name: string // Tên sản phẩm
  slug: string // Tên sản phẩm dạng slug (đã được chuyển đổi từ tên sản phẩm)
  description: string // Mô tả sản phẩm
  url_images?: Media[]
  price: number // Giá sản phẩm
  promotion_price?: number // Giá khuyến mãi
  status?: StatusType // Trạng thái sản phẩm (0: không hoạt động, 1: hoạt động)
  gender: GenderType // Giới tính của sản phẩm ( nam, nữ,tất cả)
  target_person: TargetType // Đối tượng sử dụng sản phẩm (trẻ em, người lớn)
  view?: number
  sold?: number // Số lượng đã bán của sản phẩm
  created_by: ObjectId // Người tạo sản phẩm
  created_at?: Date
  updated_at?: Date
}
export default class Product {
  _id?: ObjectId
  code_product: string // Mã sản phẩm (có thể là mã vạch hoặc mã định danh duy nhất)
  category_id: ObjectId // Danh mục
  name: string // Tên sản phẩm
  description: string // Mô tả sản phẩm
  slug: string // Tên sản phẩm dạng slug (đã được chuyển đổi từ tên sản phẩm)
  url_images?: Media[]
  price: number // Giá sản phẩm
  promotion_price?: number // Giá khuyến mãi
  status: StatusType // Trạng thái sản phẩm (0: không hiển thị, 1: hiển thị)
  gender: GenderType
  target_person: TargetType // Đối tượng sử dụng sản phẩm (trẻ em, người lớn)
  view: number // Số lượt xem của khách hàng
  sold: number // Số lượng đã bán của sản phẩm
  created_by: ObjectId // Người tạo sản phẩm
  created_at?: Date
  updated_at?: Date
  constructor(product: ProductType) {
    this._id = product._id || new ObjectId()
    this.code_product = product.code_product
    this.category_id = product.category_id
    this.name = product.name
    this.slug = product.slug
    this.description = product.description
    this.url_images = product.url_images || []
    this.price = product.price
    this.promotion_price = product.promotion_price || 0
    this.status = product.status || StatusType.Active
    this.gender = product.gender
    this.target_person = product.target_person
    this.view = product.view || 0
    this.sold = product.sold || 0
    this.created_by = product.created_by
    this.created_at = product.created_at || new Date()
    this.updated_at = product.updated_at || new Date()
  }
}
