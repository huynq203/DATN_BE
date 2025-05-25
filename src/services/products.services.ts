import slug from 'slug'
import {
  OptionProductReqBody,
  OptionProductUpdateReqBody,
  ProductReqBody,
  UpdateProductReqBody
} from '~/models/requests/Product.requests'
import Product from '~/models/schemas/Product.schema'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import mediasService from './medias.services'
import { Request, Response } from 'express'
import { Media } from '~/models/Other'
import OptionProduct from '~/models/schemas/OptionProduct.schemas'
import ExcelJS from 'exceljs'
import { PRODUCTS_MESSAGES } from '~/constants/messages'
import { StatusType } from '~/constants/enums'
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
            $match: {
              status: StatusType.Active // Assuming 1 means active products
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
          { $unwind: '$category_id' },
          {
            $lookup: {
              from: 'option_products',
              localField: '_id',
              foreignField: 'product_id',
              as: 'option_products'
            }
          },
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
              category_id: {
                _id: '$category_id._id',
                name: '$category_id.name'
              },
              name: 1,
              description: 1,
              slug: 1,
              url_images: 1,
              price: 1,
              promotion_price: 1,

              status: 1,
              view: 1,
              sold: 1,
              created_by: {
                _id: '$created_by._id',
                name: '$created_by.name'
              },
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
            $match: {
              status: StatusType.Active // Assuming 1 means active products
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
          { $unwind: '$category_id' },
          {
            $lookup: {
              from: 'option_products',
              localField: '_id',
              foreignField: 'product_id',
              as: 'option_products'
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
        { $unwind: '$category_id' },
        {
          $lookup: {
            from: 'option_products',
            localField: '_id',
            foreignField: 'product_id',
            as: 'option_products'
          }
        },
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
            category_id: {
              _id: '$category_id._id',
              name: '$category_id.name'
            },
            name: 1,
            description: 1,
            slug: 1,
            url_images: 1,
            price: 1,
            promotion_price: 1,
            option_products: 1,
            status: 1,
            view: 1,
            sold: 1,
            stock: 1,
            created_by: {
              _id: '$created_by._id',
              name: '$created_by.name'
            },
            created_at: 1,
            updated_at: 1
          }
        }
      ])
      .next()
    return product
  }

  async createProducts({ user_id, payload }: { user_id: string; payload: ProductReqBody }) {
    const generatedSlug = slug(payload.name)
    const product = await databaseService.products.insertOne(
      new Product({
        name: payload.name,
        description: payload.description,
        price: Number(payload.price),
        category_id: new ObjectId(payload.category_id),
        slug: generatedSlug,
        created_by: new ObjectId(user_id),
        url_images: payload.url_images
      })
    )
    await databaseService.optionproducts.insertOne(
      new OptionProduct({
        product_id: product.insertedId,
        size: Number(payload.size),
        color: payload.color,
        stock: Number(payload.stock),
        created_by: new ObjectId(user_id)
      })
    )

    const result = await databaseService.products.findOne({
      _id: product.insertedId
    })
    return result
  }
  async updateProducts({ user_id, payload }: { user_id: string; payload: UpdateProductReqBody }) {
    const _payload = payload.name ? { ...payload, slug: slug(payload.name) } : payload
    const result = await databaseService.products.findOneAndUpdate(
      { _id: new ObjectId(payload.product_id) },
      [
        {
          $set: {
            ..._payload,
            price: Number(payload.price),
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

  async uploadImagebyProduct({ user_id, product_id, req }: { user_id: string; product_id: string; req: Request }) {
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

  async uploadImageProduct({ req }: { req: Request }) {
    const url_images = await mediasService.uploadImage(req, 'products')
    return url_images
  }

  async getAllProductManager() {
    const result = await databaseService.products
      .aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'category_id',
            foreignField: '_id',
            as: 'category_id'
          }
        },
        { $unwind: '$category_id' },
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
          $sort: {
            created_at: -1
          }
        },
        {
          $project: {
            _id: 1,
            category_id: {
              _id: '$category_id._id',
              name: '$category_id.name'
            },
            name: 1,
            description: 1,
            slug: 1,
            price: 1,
            promotion_price: 1,
            status: 1,
            url_images: 1,
            view: 1,
            sold: 1,
            created_by: {
              _id: '$created_by._id',
              name: '$created_by.name'
            },
            created_at: 1,
            updated_at: 1
          }
        }
      ])
      .toArray()

    return result
  }
  async getOptionProduct(product_id: string) {
    const result = await databaseService.optionproducts
      .aggregate([
        {
          $match: {
            product_id: new ObjectId(product_id)
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'created_by',
            foreignField: '_id',
            as: 'created_by'
          }
        },
        { $sort: { created_at: -1 } }
      ])
      .toArray()
    return result
  }

  async createOptionProduct({ user_id, payload }: { user_id: string; payload: OptionProductReqBody }) {
    const findOptionProduct = await databaseService.optionproducts.findOne({
      product_id: new ObjectId(payload.product_id),
      size: Number(payload.size),
      color: payload.color
    })
    if (findOptionProduct) {
      const result = await databaseService.optionproducts.findOneAndUpdate(
        {
          _id: findOptionProduct._id
        },
        {
          $inc: {
            stock: Number(payload.stock)
          },
          $set: {
            updated_at: new Date()
          }
        },
        {
          returnDocument: 'after'
        }
      )
      return result
    } else {
      const optionProduct = await databaseService.optionproducts.insertOne(
        new OptionProduct({
          product_id: new ObjectId(payload.product_id),
          size: Number(payload.size),
          color: payload.color,
          stock: Number(payload.stock),
          created_by: new ObjectId(user_id)
        })
      )
      const result = await databaseService.optionproducts.findOne({
        _id: optionProduct.insertedId
      })
      return result
    }
  }
  async updateOptionProduct({ user_id, payload }: { user_id: string; payload: OptionProductUpdateReqBody }) {
    const optionProduct = await databaseService.optionproducts.findOne({
      product_id: new ObjectId(payload.product_id),
      size: Number(payload.size),
      color: payload.color
    })
    if (optionProduct) {
      throw new Error(PRODUCTS_MESSAGES.OPTION_PRODUCT_EXISTS)
    } else {
      const result = await databaseService.optionproducts.findOneAndUpdate(
        {
          _id: new ObjectId(payload.optionProduct_id)
        },
        {
          $set: {
            size: Number(payload.size),
            color: payload.color,
            stock: Number(payload.stock),
            updated_at: new Date(),
            created_by: new ObjectId(user_id)
          }
        },
        {
          returnDocument: 'after'
        }
      )
      return result
    }
  }
  async deleteOptionProduct(optionProduct_id: string) {
    await databaseService.optionproducts.deleteOne({
      _id: new ObjectId(optionProduct_id)
    })
  }
  async exportFile({ req, res }: { req: Request; res: Response }) {
    const products = await databaseService.products
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
          $lookup: {
            from: 'users',
            localField: 'created_by',
            foreignField: '_id',
            as: 'created_by'
          }
        },
        {
          $sort: {
            created_at: -1
          }
        },
        {
          $project: {
            _id: 1,
            'category_id.name': 1,
            name: 1,
            description: 1,
            slug: 1,
            price: 1,
            promotion_price: 1,
            'created_by.name': 1,
            created_at: 1,
            updated_at: 1
          }
        }
      ])
      .toArray()

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Products')

    worksheet.columns = [
      { header: 'ID', key: '_id', width: 30 },
      { header: 'Category', key: 'category_id', width: 30 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Slug', key: 'slug', width: 30 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Promotion Price', key: 'promotion_price', width: 15 },
      { header: 'Created By', key: 'created_by', width: 30 },
      { header: 'Created At', key: 'created_at', width: 20 },
      { header: 'Updated At', key: 'updated_at', width: 20 }
    ]
    products.forEach((item) => {
      worksheet.addRow(item)
    })

    const result = await workbook.xlsx.write(res)
    res.end()
    return result
  }
}
const productsService = new ProductsSerice()
export default productsService
