import slug from 'slug'
import { ProductReqBody, UpdateProductReqBody } from '~/models/requests/Product.requests'
import Product from '~/models/schemas/Product.schema'
import databaseService from './database.services'
import { ObjectId, ReturnDocument } from 'mongodb'
import mediasService from './medias.services'
import { Request } from 'express'
import { Media } from '~/models/Other'
import { MediaType } from '~/constants/enums'

class ProductsSerice {
  async getAllProducts() {}
  async getProductById() {}

  async createProducts({ user_id, payload }: { user_id: string; payload: ProductReqBody }) {
    const generatedSlug = slug(payload.name)
    const product = await databaseService.products.insertOne(
      new Product({
        ...payload,
        category_id: new ObjectId(payload.category_id),
        slug: generatedSlug,
        created_by: new ObjectId(user_id)
      })
    )
    const result = await databaseService.products.findOne({
      _id: product.insertedId
    })
    return result
  }
  async updateProducts({
    user_id,
    product_id,
    payload
  }: {
    user_id: string
    product_id: string
    payload: UpdateProductReqBody
  }) {
    const _payload = payload.name ? { ...payload, slug: slug(payload.name) } : payload
    const result = await databaseService.products.findOneAndUpdate(
      { _id: new ObjectId(product_id) },
      [
        {
          $set: {
            ..._payload,
            created_by: new ObjectId(user_id),
            updated_at: '$$NOW'
          }
        }
      ],
      {
        returnDocument: 'after'
      }
    )
    return result
  }
  async deleteProducts(product_id: string) {
    await databaseService.products.deleteOne({
      _id: new ObjectId(product_id)
    })
  }

  async uploadImageProduct({ user_id, product_id, req }: { user_id: string; product_id: string; req: Request }) {
    const url_images = await mediasService.uploadImage(req, 'products')
    const product = await databaseService.products.findOne({
      _id: new ObjectId(product_id)
    })
    const images = product?.url_images?.map((item) => item) as Array<Media>
    images.push(...url_images)

    const result = await databaseService.products.findOneAndUpdate(
      {
        _id: new ObjectId(product_id)
      },
      [
        {
          $set: {
            // url_images: { $concatArrays: [url_images, '$url_images'] },
            url_images: images,
            created_by: new ObjectId(user_id),
            updated_at: '$$NOW'
          }
        }
      ],
      {
        returnDocument: 'after'
      }
    )
    return result
  }
}
const productsService = new ProductsSerice()
export default productsService
