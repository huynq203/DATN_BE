import { ObjectId } from 'mongodb'

interface ColorType {
  _id?: ObjectId
  product_id: ObjectId
  color_name: string
  description?: string
  created_by: ObjectId
  created_at?: Date
  updated_at?: Date
}

export default class Color {
  _id: ObjectId
  product_id: ObjectId
  color_name: string
  description: string
  created_by: ObjectId
  created_at: Date
  updated_at: Date
  constructor(color: ColorType) {
    const date = new Date()
    this._id = color._id || new ObjectId()
    this.product_id = color.product_id
    this.color_name = color.color_name
    this.description = color.description || ''
    this.created_by = color.created_by
    this.created_at = color.created_at || date
    this.updated_at = color.updated_at || date
  }
}
