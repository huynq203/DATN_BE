import slug from 'slug'
import { ProductReqBody } from '~/models/requests/Product.requests'
import Product from '~/models/schemas/Product.schema'
import databaseService from './database.services'

class ProductsSerice {
  async createCategory(payload: ProductReqBody) {
    const generatedSlug = slug(payload.description)
    // const category = await databaseService.products.insertOne(
    //   new Product({
    //     ...payload,
    //     slug: generatedSlug,
    //     created_by: new ObjectId(payload.created_by)
    //   })
    // )
    // const result = await databaseService.categories.findOne({
    //   _id: category.insertedId
    // })
    // return result
  }
}
const productsService = new ProductsSerice()
export default productsService
