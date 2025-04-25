import { ObjectId } from 'mongodb'

export interface CategoryReqBody {
  name: string
  description: string
  slug?: string
  created_by: ObjectId
}
