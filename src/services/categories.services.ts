import { CategoryReqBody, UpdateCategoryReqBody } from '~/models/requests/Category.requests'
import slug from 'slug'
import databaseService from './database.services'
import Category from '~/models/schemas/Category.schema'
import { ObjectId } from 'mongodb'
class CategoriesSerice {
  async getAllCategories({ limit, page }: { limit: number; page: number }) {
    const categories = await databaseService.categories
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ created_at: -1 })
      .toArray()
    const total = await databaseService.categories.countDocuments()
    return {
      categories,
      total
    }
  }
  async getCategoryById(category_id: string) {
    const category = await databaseService.categories.findOne({
      _id: new ObjectId(category_id)
    })
    return category
  }

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
  async updateCategory({
    user_id,
    product_id,
    payload
  }: {
    user_id: string
    product_id: string
    payload: UpdateCategoryReqBody
  }) {
    const _payload = payload.description ? { ...payload, slug: slug(payload.description) } : payload
    const category = await databaseService.categories.findOneAndUpdate(
      {
        _id: new ObjectId(product_id)
      },
      [
        {
          $set: {
            ..._payload,
            created_by: new ObjectId(user_id),
            updated_at: '$$NOW'
          }
        }
      ],
      { returnDocument: 'after' }
    )
    return category
  }
  async deleteCategory(product_id: string) {
    await databaseService.categories.findOneAndDelete({
      _id: new ObjectId(product_id)
    })
  }
}

const categoriesService = new CategoriesSerice()
export default categoriesService
