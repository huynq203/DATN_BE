import { ObjectId } from 'mongodb'

interface SizeType {
  _id?: ObjectId
  size_name: string
  description: string
  created_by: ObjectId
  created_at?: Date
  updated_at?: Date
}

export default class Size {
  _id: ObjectId
  size_name: string
  description: string
  created_by: ObjectId
  created_at: Date
  updated_at: Date
  constructor(size: SizeType) {
    const date = new Date()
    this._id = size._id || new ObjectId()
    this.size_name = size.size_name
    this.description = size.description
    this.created_by = size.created_by
    this.created_at = size.created_at || date
    this.updated_at = size.updated_at || date
  }
}
