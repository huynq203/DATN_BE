import { ObjectId } from 'mongodb'
import { StatusType } from '~/constants/enums'
interface CategoryType {
  _id?: ObjectId
  name: string
  description: string
  slug?: string
  status?: StatusType
  created_by: ObjectId
  created_at?: Date
  updated_at?: Date
}

export default class Category {
  _id: ObjectId
  name: string
  description: string
  slug: string
  status: StatusType
  created_by: ObjectId
  created_at: Date
  updated_at: Date

  constructor(category: CategoryType) {
    const date = new Date()
    this._id = category._id || new ObjectId()
    this.name = category.name
    this.description = category.description
    this.slug = category.slug || ''
    this.status = category.status || StatusType.Active
    this.created_by = category.created_by
    this.created_at = category.created_at || date
    this.updated_at = category.updated_at || date
  }
}
