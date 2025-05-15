import { ObjectId } from 'mongodb'
import { CartStatus } from '~/constants/enums'

interface CartType {
  _id?: ObjectId
  customer_id: ObjectId
  product_id: ObjectId
  quantity: number
  size: number
  color: string
  status: CartStatus
  created_at?: Date
  updated_at?: Date
}

export default class Cart {
  _id: ObjectId
  customer_id: ObjectId
  product_id: ObjectId
  quantity: number
  size: number
  color: string
  status: CartStatus
  created_at: Date
  updated_at: Date

  constructor(cart: CartType) {
    this._id = cart._id || new ObjectId()
    this.customer_id = cart.customer_id
    this.product_id = cart.product_id
    this.quantity = cart.quantity
    this.size = cart.size
    this.color = cart.color
    this.status = cart.status || CartStatus.InCart
    this.created_at = cart.created_at || new Date()
    this.updated_at = cart.updated_at || new Date()
  }
}
