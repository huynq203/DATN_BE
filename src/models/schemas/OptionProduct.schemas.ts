import { ObjectId } from 'mongodb'

interface OptionProductType {
  _id?: ObjectId
  product_id: ObjectId
  size: number
  color: string
  stock: number
  created_by: ObjectId
  created_at?: Date
  updated_at?: Date
}

export default class OptionProduct {
  _id: ObjectId
  product_id: ObjectId
  size: number
  color: string
  stock: number
  created_by: ObjectId
  created_at: Date
  updated_at: Date

  constructor(optionProduct: OptionProductType) {
    const date = new Date()
    this._id = optionProduct._id || new ObjectId()
    this.product_id = optionProduct.product_id
    this.size = optionProduct.size
    this.color = optionProduct.color
    this.stock = optionProduct.stock
    this.created_by = optionProduct.created_by
    this.created_at = optionProduct.created_at || date
    this.updated_at = optionProduct.updated_at || date
  }
}
