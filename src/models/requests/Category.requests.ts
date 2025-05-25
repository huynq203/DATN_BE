import { ObjectId } from 'mongodb'

export interface CategoryReqBody {
  name: string
  description: string
  slug?: string
}

export interface UpdateCategoryReqBody {
  category_id: string
  name?: string
  description?: string
  slug?: string
}
