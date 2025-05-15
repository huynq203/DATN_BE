import { ObjectId } from 'mongodb'

interface RatingType {
  _id?: ObjectId
  product_id: ObjectId // ID sản phẩm
  customer_id: ObjectId // ID khách hàng
  star: number // Đánh giá (1-5)
  comment?: string // Bình luận
  created_at?: Date // Ngày tạo đánh giá
  updated_at?: Date // Ngày cập nhật đánh giá
}

export default class Rating {
  _id: ObjectId
  product_id: ObjectId // ID sản phẩm
  customer_id: ObjectId // ID khách hàng
  star: number // Đánh giá (1-5)
  comment: string // Bình luận
  created_at: Date // Ngày tạo đánh giá
  updated_at: Date // Ngày cập nhật đánh giá
  constructor(rating: RatingType) {
    this._id = rating._id || new ObjectId()
    this.product_id = rating.product_id
    this.customer_id = rating.customer_id
    this.star = rating.star
    this.comment = rating.comment || ''
    this.created_at = rating.created_at || new Date()
    this.updated_at = rating.updated_at || new Date()
  }
}
