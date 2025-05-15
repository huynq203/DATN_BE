import slug from 'slug'
import { ProductReqBody, UpdateProductReqBody } from '~/models/requests/Product.requests'
import Product from '~/models/schemas/Product.schema'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import mediasService from './medias.services'
import { Request } from 'express'
import { Media } from '~/models/Other'
class ProductsSerice {
  async getAllProducts({
    limit,
    page,
    sort_by,
    order,
    category_id,
    price_min,
    price_max,
    name
  }: {
    limit: number
    page: number
    sort_by: string
    order: number
    category_id: string
    price_min: number
    price_max: number
    name: string
  }) {
    const category = category_id
      ? {
          $match: {
            category_id: new ObjectId(category_id)
          }
        }
      : null
    const filterPrice =
      price_min || price_max
        ? {
            $match: {
              price: { $gte: price_min, $lte: price_max }
            }
          }
        : null
    const promotion_price =
      sort_by === 'promotion_price'
        ? {
            $match: {
              promotion_price: { $gt: 0 }
            }
          }
        : null

    const filterName = name
      ? {
          $match: {
            name: {
              $regex: name,
              $options: 'i'
            }
          }
        }
      : null
    const [products, total] = await Promise.all([
      databaseService.products
        .aggregate([
          ...(category ? [category] : []),
          ...(filterPrice ? [filterPrice] : []),
          ...(promotion_price ? [promotion_price] : []),
          ...(filterName ? [filterName] : []),
          {
            $lookup: {
              from: 'categories',
              localField: 'category_id',
              foreignField: '_id',
              as: 'category_id'
            }
          },
          {
            $unwind: {
              path: '$categories',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'sizes',
              localField: '_id',
              foreignField: 'product_id',
              as: 'sizes'
            }
          },
          {
            $lookup: {
              from: 'colors',
              localField: '_id',
              foreignField: 'product_id',
              as: 'colors'
            }
          },
          {
            $project: {
              _id: 1,
              'category_id._id': 1,
              'category_id.name': 1,
              name: 1,
              description: 1,
              slug: 1,
              url_images: 1,
              price: 1,
              promotion_price: 1,
              'sizes._id': 1,
              'sizes.size_name': 1,
              'colors._id': 1,
              'colors.color_name': 1,
              status: 1,
              view: 1,
              sold: 1,
              stock: 1,
              created_by: 1,
              created_at: 1,
              updated_at: 1
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          },
          {
            $sort: {
              [sort_by]: order
            }
          }
        ])
        .toArray(),
      databaseService.products
        .aggregate([
          {
            $lookup: {
              from: 'categories',
              localField: 'category_id',
              foreignField: '_id',
              as: 'category_id'
            }
          },
          {
            $unwind: {
              path: '$categories',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'sizes',
              localField: '_id',
              foreignField: 'product_id',
              as: 'sizes'
            }
          },
          {
            $lookup: {
              from: 'colors',
              localField: '_id',
              foreignField: 'product_id',
              as: 'colors'
            }
          },

          {
            $project: {
              _id: 1,
              'category_id._id': 1,
              'category_id.name': 1,
              name: 1,
              description: 1,
              slug: 1,
              url_images: 1,
              price: 1,
              promotion_price: 1,
              'sizes._id': 1,
              'sizes.size_name': 1,
              'colors._id': 1,
              'colors.color_name': 1,
              status: 1,
              view: 1,
              sold: 1,
              stock: 1
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])
    return {
      products,
      total: total[0]?.total || 0
    }
  }
  async getProductById(product_id: string) {
    await databaseService.products.findOneAndUpdate(
      {
        _id: new ObjectId(product_id)
      },
      {
        $inc: {
          view: 1
        }
      },
      { returnDocument: 'after' }
    )

    const product = await databaseService.products
      .aggregate([
        {
          $match: {
            _id: new ObjectId(product_id)
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category_id',
            foreignField: '_id',
            as: 'category_id'
          }
        },
        {
          $unwind: {
            path: '$categories',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'sizes',
            localField: '_id',
            foreignField: 'product_id',
            as: 'sizes'
          }
        },
        {
          $lookup: {
            from: 'colors',
            localField: '_id',
            foreignField: 'product_id',
            as: 'colors'
          }
        },
        {
          $project: {
            _id: 1,
            'category_id._id': 1,
            'category_id.name': 1,
            name: 1,
            description: 1,
            slug: 1,
            url_images: 1,
            price: 1,
            promotion_price: 1,
            'sizes._id': 1,
            'sizes.size_name': 1,
            'colors._id': 1,
            'colors.color_name': 1,
            status: 1,
            view: 1,
            sold: 1,
            stock: 1
          }
        }
      ])
      .next()
    return product
  }

  async createProducts({ user_id, payload }: { user_id: string; payload: ProductReqBody }) {
    const generatedSlug = slug(payload.name)
    const sizes_list = []
    sizes_list.push(new ObjectId(payload.sizes.toString()))
    const product = await databaseService.products.insertOne(
      new Product({
        ...payload,
        category_id: new ObjectId(payload.category_id),
        slug: generatedSlug,
        created_by: new ObjectId(user_id),
        sizes: sizes_list
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
