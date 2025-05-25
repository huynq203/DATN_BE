import { ObjectId } from 'mongodb'

interface OrderDetailType {
  _id?: ObjectId
  order_id: ObjectId
  product_id: ObjectId
  cart_id?: ObjectId
  quantity: number
  size: number
  color: string
  created_at?: Date
  updated_at?: Date
}

export default class OrderDetail {
  _id: ObjectId
  order_id: ObjectId
  product_id: ObjectId
  cart_id: ObjectId
  quantity: number
  size: number
  color: string
  created_at: Date
  updated_at: Date

  constructor(orderDetail: OrderDetailType) {
    const date = new Date()
    this._id = orderDetail._id || new ObjectId()
    this.order_id = orderDetail.order_id
    this.product_id = orderDetail.product_id
    this.cart_id = orderDetail.cart_id || new ObjectId()
    this.quantity = orderDetail.quantity
    this.size = orderDetail.size
    this.color = orderDetail.color
    this.created_at = orderDetail.created_at || date
    this.updated_at = orderDetail.updated_at || date
  }
}
