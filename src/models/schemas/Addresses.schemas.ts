import { ObjectId } from 'mongodb'

interface AddressType {
  _id?: ObjectId
  customer_id: ObjectId
  address: string
  created_at?: Date
  updated_at?: Date
}

export default class Address {
  _id: ObjectId
  customer_id: ObjectId
  address: string
  created_at: Date
  updated_at: Date
  constructor(address: AddressType) {
    const date = new Date()
    this._id = address._id || new ObjectId()
    this.customer_id = address.customer_id
    this.address = address.address
    this.created_at = address.created_at || date
    this.updated_at = address.updated_at || date
  }
}
