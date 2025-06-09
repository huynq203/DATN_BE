import { ObjectId } from 'mongodb'
import { isDefault } from '~/constants/enums'

interface AddressType {
  _id?: ObjectId
  customer_id: ObjectId
  name: string
  phone: string
  address: string
  isDefault: isDefault
  created_at?: Date
  updated_at?: Date
}

export default class Address {
  _id: ObjectId
  customer_id: ObjectId
  name: string
  phone: string
  address: string
  isDefault?: isDefault
  created_at: Date
  updated_at: Date
  constructor(address: AddressType) {
    this._id = address._id || new ObjectId()
    this.customer_id = address.customer_id
    this.name = address.name
    this.phone = address.phone
    this.address = address.address
    this.isDefault = address.isDefault
    this.created_at = address.created_at || new Date()
    this.updated_at = address.updated_at || new Date()
  }
}
