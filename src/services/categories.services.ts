import { CategoryReqBody, UpdateCategoryReqBody } from '~/models/requests/Category.requests'
import slug from 'slug'
import databaseService from './database.services'
import Category from '~/models/schemas/Category.schema'
import { ObjectId } from 'mongodb'
class CategoriesSerice {
  async getAllCategories() {
    // const categories = await databaseService.categories.find().sort({ created_at: -1 }).toArray()
    const categories = await databaseService.categories
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'created_by',
            foreignField: '_id',
            as: 'created_by'
          }
        },
        { $unwind: '$created_by' },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            slug: 1,
            created_at: 1,
            updated_at: 1,
            created_by: {
              _id: '$created_by._id',
              name: '$created_by.name'
            }
          }
        },
        {
          $sort: { created_at: -1 }
        }
      ])
      .toArray()
    return categories
  }
  async getCategoryById(category_id: string) {
    const category = await databaseService.categories.findOne({
      _id: new ObjectId(category_id)
    })
    return category
  }

  async createCategory({ user_id, payload }: { user_id: string; payload: CategoryReqBody }) {
    const generatedSlug = slug(payload.description)
    const category = await databaseService.categories.insertOne(
      new Category({
        ...payload,
        slug: generatedSlug,
        created_by: new ObjectId(user_id)
      })
    )
    const result = await databaseService.categories.findOne({
      _id: category.insertedId
    })
    return result
  }
  async updateCategory({ user_id, payload }: { user_id: string; payload: UpdateCategoryReqBody }) {
    const _payload = payload.description ? { ...payload, slug: slug(payload.description) } : payload
    const category = await databaseService.categories.findOneAndUpdate(
      {
        _id: new ObjectId(payload.category_id)
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
  async deleteCategory(category_id: string) {
    await databaseService.categories.findOneAndDelete({
      _id: new ObjectId(category_id)
    })
  }
}

const categoriesService = new CategoriesSerice()
export default categoriesService
