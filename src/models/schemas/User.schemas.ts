import { ObjectId } from 'mongodb'

interface UserType {
  _id?: ObjectId
  name: string
  email: string
  phone: string
  password: string
  date_of_birth: Date
  address: string
  role: ObjectId
  created_by: ObjectId
  created_at?: Date
  updated_at?: Date
}

export default class User {
  _id: ObjectId
  name: string
  email: string
  phone: string
  password: string
  date_of_birth: Date
  address: string
  role: ObjectId
  created_by?: ObjectId
  created_at: Date
  updated_at: Date
  constructor(user: UserType) {
    const date = new Date()
    this._id = user._id || new ObjectId()
    this.name = user.name
    this.email = user.email
    this.phone = user.phone
    this.password = user.password
    this.date_of_birth = user.date_of_birth
    this.address = user.address
    this.role = user.role
    this.created_by = user.created_by
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
  }
}
