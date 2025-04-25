import { CategoryReqBody } from '~/models/requests/Category.requests'
import slug from 'slug'
import databaseService from './database.services'
import Category from '~/models/schemas/Category.schema'
import { ObjectId } from 'mongodb'
class CategoriesSerice {
  async createCategory(payload: CategoryReqBody) {
    const generatedSlug = slug(payload.description)
    const category = await databaseService.categories.insertOne(
      new Category({
        ...payload,
        slug: generatedSlug,
        created_by: new ObjectId(payload.created_by)
      })
    )
    const result = await databaseService.categories.findOne({
      _id: category.insertedId
    })
    return result
  }
}

const categoriesService = new CategoriesSerice()
export default categoriesService
