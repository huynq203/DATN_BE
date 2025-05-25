import { ObjectId } from 'mongodb'
import { StatusType, UserVerifyStatus } from '~/constants/enums'

interface CustomerType {
  _id?: ObjectId
  name: string
  email: string
  phone?: string
  password: string
  date_of_birth?: Date
  address?: ObjectId[]
  email_verify_token?: string //jwt hoặc '' nếu đã xác thực email
  forgot_password_token?: string //jwt hoặc '' nếu đã xác thực email
  verify?: UserVerifyStatus
  status?: StatusType
  cart?: ObjectId[]
  wishlist?: ObjectId[]
  created_at?: Date
  updated_at?: Date
}

export default class Customer {
  _id: ObjectId
  name: string
  email: string
  phone: string
  password: string
  date_of_birth?: Date
  email_verify_token?: string //jwt hoặc '' nếu đã xác thực email
  forgot_password_token?: string //jwt hoặc '' nếu đã xác thực email
  verify: UserVerifyStatus
  status: StatusType
  cart: ObjectId[]
  wishlist: ObjectId[]
  created_at: Date
  updated_at: Date
  constructor(customer: CustomerType) {
    const date = new Date()
    this._id = customer._id || new ObjectId()
    this.name = customer.name
    this.email = customer.email
    this.phone = customer.phone || ''
    this.password = customer.password
    this.date_of_birth = customer.date_of_birth
    this.email_verify_token = customer.email_verify_token || ''
    this.forgot_password_token = customer.forgot_password_token || ''
    this.verify = customer.verify || UserVerifyStatus.Unverified
    this.status = customer.status || StatusType.Active
    this.cart = customer.cart || []
    this.wishlist = customer.wishlist || []
    this.created_at = customer.created_at || date
    this.updated_at = customer.updated_at || date
  }
}
