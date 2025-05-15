import { ObjectId } from 'mongodb'
import { OrderStatus, PaymentMethod, PaymentStatus } from '~/constants/enums'

interface OrderType {
  _id?: ObjectId
  customer_id: ObjectId
  name?: string
  phone?: string
  address: string
  order_status: OrderStatus
  payment_method: PaymentMethod
  // payment_status: PaymentStatus
  total_price: number
  coupon_code?: string
  order_details?: ObjectId[]
  created_at?: Date
  updated_at?: Date
}

export default class Order {
  _id?: ObjectId
  customer_id: ObjectId
  name: string
  phone: string
  address: string
  order_status: OrderStatus
  payment_method: PaymentMethod
  // payment_status: PaymentStatus
  total_price: number
  order_details: ObjectId[]
  created_at?: Date
  updated_at?: Date
  constructor(order: OrderType) {
    const date = new Date()
    this._id = order._id || new ObjectId()
    this.customer_id = order.customer_id
    this.name = order.name || ''
    this.phone = order.phone || ''
    this.address = order.address
    this.order_status = order.order_status || OrderStatus.Pending
    this.payment_method = order.payment_method
    // this.payment_status = order.payment_status
    this.total_price = order.total_price
    this.order_details = order.order_details || []
    this.created_at = order.created_at || date
    this.updated_at = order.updated_at || date
  }
}
