import { ObjectId } from 'mongodb'

interface RoleType {
  _id?: ObjectId
  role_name: string
  description: string
  created_at?: Date
  updated_at?: Date
}

export default class Role {
  _id: ObjectId
  role_name: string
  description: string
  created_at?: Date
  updated_at?: Date
  constructor(role: RoleType) {
    const date = new Date()
    this._id = role._id || new ObjectId()
    this.role_name = role.role_name
    this.description = role.description
    this.created_at = role.created_at || date
    this.updated_at = role.updated_at || date
  }
}
