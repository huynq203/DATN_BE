import slug from 'slug'
import {
  ChangeStatusOptionProduct,
  ChangeStatusProduct,
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
import { GenderType, StatusType, TargetType } from '~/constants/enums'
import { ErrorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'
import PurchaseOrder from '~/models/schemas/PurchaseOrders.schemas'
import PurchaseOrderItem from '~/models/schemas/PurchaseOrderItems.schemas'
import Inventory from '~/models/schemas/Inventories.schemas'

class ProductsSerice {
  async getAllProducts({
    limit,
    page,
    sort_by,
    order,
    category_id,
    price_min,
    price_max,
    key_search,
    gender,
    target_person
  }: {
    limit: number
    page: number
    sort_by: string
    order: number
    category_id: string
    price_min: number
    price_max: number
    key_search: string
    gender: GenderType
    target_person: TargetType
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

    const filterName = key_search
      ? {
          $match: {
            name: {
              $regex: key_search,
              $options: 'i'
            }
          }
        }
      : null

    const filterGender =
      gender >= 0
        ? gender === GenderType.All
          ? null
          : {
              $match: {
                gender: gender
              }
            }
        : null

    const filterTarget =
      target_person >= 0
        ? target_person === TargetType.All
          ? null
          : {
              $match: {
                target_person: target_person
              }
            }
        : null

    const [products, total] = await Promise.all([
      databaseService.products
        .aggregate([
          ...(category ? [category] : []),
          ...(filterPrice ? [filterPrice] : []),
          ...(promotion_price ? [promotion_price] : []),
          ...(filterGender ? [filterGender] : []),
          ...(filterTarget ? [filterTarget] : []),
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
              gender: 1,
              target_person: 1,
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
    const [product, inventories] = await Promise.all([
      databaseService.products
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
              status: 1,
              gender: 1,
              target_person: 1,
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
        .next(),
      databaseService.inventories
        .aggregate([
          {
            $match: {
              product_id: new ObjectId(product_id),
              status: StatusType.Active,
              stock: { $gt: 0 } // Only include inventories with stock greater than 0
            }
          },
          {
            $lookup: {
              from: 'option_products',
              localField: 'option_product_id',
              foreignField: '_id',
              as: 'option_product_id'
            }
          },
          {
            $unwind: '$option_product_id'
          },
          {
            $group: {
              inventory_id: { $first: '$_id' },
              _id: '$option_product_id._id',
              color: {
                $first: '$option_product_id.color'
              },
              size: {
                $first: '$option_product_id.size'
              },
              stock: { $sum: '$stock' },
              cost_price: {
                $first: '$cost_price'
              },
              sold: {
                $first: '$sold'
              },
              image_variant_color: {
                $first: '$option_product_id.image_variant_color'
              }
            }
          },
          {
            $project: {
              _id: 1,
              inventory_id: 1,
              option_product_id: 1,
              color: 1,
              size: 1,
              image_variant_color: 1,
              stock: 1,
              cost_price: 1,
              status: 1,
              sold: 1
            }
          }
        ])
        .toArray()
    ])

    return { product, inventories }
  }

  async createProducts({ user_id, payload }: { user_id: string; payload: ProductReqBody }) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    const generatedSlug = slug(payload.name)
    const product = await databaseService.products.insertOne(
      new Product({
        code_product: 'SP-' + code, // Generate a random code for the product
        name: payload.name,
        description: payload.description,
        price: Number(payload.price),
        category_id: new ObjectId(payload.category_id),
        slug: generatedSlug,
        created_by: new ObjectId(user_id),
        url_images: payload.url_images,
        gender: payload.gender,
        target_person: payload.target_person
      })
    )
    // await databaseService.optionproducts.insertOne(
    //   new OptionProduct({
    //     product_id: product.insertedId,
    //     size: Number(payload.size),
    //     color: payload.color,
    //     stock: Number(payload.stock),
    //     image_variant_color: payload.image_variant_color,
    //     created_by: new ObjectId(user_id)
    //   })
    // )

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
            promotion_price: Number(payload.promotion_price),
            gender: Number(payload.gender),
            target_person: Number(payload.target_person),
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
  //tạm thời bỏ
  // async uploadImagebyProduct({ user_id, product_id, req }: { user_id: string; product_id: string; req: Request }) {
  //   const url_images = await mediasService.uploadImage(req, 'products')
  //   const product = await databaseService.products.findOne({
  //     _id: new ObjectId(product_id)
  //   })
  //   const images = product?.url_images?.map((item) => item) as Array<Media>
  //   images.push(...url_images)
  //   const result = await databaseService.products.findOneAndUpdate(
  //     {
  //       _id: new ObjectId(product_id)
  //     },
  //     [
  //       {
  //         $set: {
  //           // url_images: { $concatArrays: [url_images, '$url_images'] },
  //           url_images: images,
  //           created_by: new ObjectId(user_id),
  //           updated_at: '$$NOW'
  //         }
  //       }
  //     ],
  //     {
  //       returnDocument: 'after'
  //     }
  //   )
  //   return result
  // }

  async uploadImageProduct({ req }: { req: Request }) {
    const url_images = await mediasService.uploadImage(req, 'products')
    return url_images
  }

  async uploadImageVariantColor({ req }: { req: Request }) {
    const url_image = await mediasService.uploadImage(req, 'variant_color')
    return url_image
  }

  async getAllProductManager({
    key_search,
    category_id,
    status,
    gender,
    target_person,
    price_min,
    price_max
  }: {
    key_search: string
    category_id: string
    status: string
    gender: string
    target_person: string
    price_min?: number
    price_max?: number
  }) {
    const filterKeySearch = key_search
      ? {
          $match: {
            $or: [
              { name: { $regex: key_search, $options: 'i' } },
              { code_product: { $regex: key_search, $options: 'i' } }
            ]
          }
        }
      : null

    const filterCategory = category_id ? { $match: { category_id: new ObjectId(category_id) } } : null
    const filterStatus = status ? { $match: { status: Number(status) } } : null
    const filterGender = gender ? { $match: { gender: Number(gender) } } : null
    const filterTargetPerson = target_person ? { $match: { target_person: Number(target_person) } } : null
    const filterPriceMin = price_min
      ? {
          $match: {
            price: { $gte: price_min }
          }
        }
      : null
    const filterPriceMax = price_max
      ? {
          $match: {
            price: { $lte: price_max }
          }
        }
      : null
    const result = await databaseService.products
      .aggregate([
        ...(filterCategory ? [filterCategory] : []),
        ...(filterKeySearch ? [filterKeySearch] : []),
        ...(filterStatus ? [filterStatus] : []),
        ...(filterGender ? [filterGender] : []),
        ...(filterTargetPerson ? [filterTargetPerson] : []),
        ...(filterPriceMin ? [filterPriceMin] : []),
        ...(filterPriceMax ? [filterPriceMax] : []),
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
            from: 'inventories',
            localField: '_id',
            foreignField: 'product_id',
            as: 'inventories'
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
          $sort: {
            created_at: -1
          }
        },
        {
          $project: {
            _id: 1,
            code_product: 1,
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
            stock: {
              $sum: {
                $map: {
                  input: '$inventories',
                  as: 'inventory',
                  in: '$$inventory.stock'
                }
              }
            },
            gender: 1,
            target_person: 1,
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
            // status: StatusType.Active // Assuming 1 means active option products
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
          $lookup: {
            from: 'inventories',
            localField: '_id',
            foreignField: 'option_product_id',
            as: 'inventories'
          }
        },
        {
          $project: {
            _id: 1,
            product_id: 1,
            size: 1,
            color: 1,
            image_variant_color: 1,
            status: 1,
            created_by: {
              _id: { $arrayElemAt: ['$created_by._id', 0] },
              name: { $arrayElemAt: ['$created_by.name', 0] }
            },
            created_at: 1,
            updated_at: 1,
            stock: {
              $sum: {
                $map: {
                  input: '$inventories',
                  as: 'inventories',
                  in: '$$inventories.stock'
                }
              }
            },
            sold: {
              $sum: {
                $map: {
                  input: '$inventories',
                  as: 'inventories',
                  in: '$$inventories.sold'
                }
              }
            }
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
      throw new ErrorWithStatus({
        message: PRODUCTS_MESSAGES.OPTION_PRODUCT_EXISTS,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    } else {
      const option_product = await databaseService.optionproducts.insertOne(
        new OptionProduct({
          product_id: new ObjectId(payload.product_id),
          size: Number(payload.size),
          color: payload.color,
          created_by: new ObjectId(user_id),
          image_variant_color: payload.image_variant_color
        })
      )
      await databaseService.inventories.insertOne(
        new Inventory({
          option_product_id: new ObjectId(option_product.insertedId),
          product_id: new ObjectId(payload.product_id),
          stock: Number(payload.stock),
          cost_price: Number(payload.cost_price),
          created_by: new ObjectId(user_id)
        })
      )
      const purchase_order = await databaseService.purchase_orders.insertOne(
        new PurchaseOrder({
          total_price: Number(payload.cost_price) * Number(payload.stock),
          created_by: new ObjectId(user_id)
        })
      )
      await databaseService.purchase_orders_items.insertOne(
        new PurchaseOrderItem({
          purchase_order_id: new ObjectId(purchase_order.insertedId),
          option_product_id: new ObjectId(option_product.insertedId),
          stock: Number(payload.stock),
          cost_price: Number(payload.cost_price),
          created_by: new ObjectId(user_id)
        })
      )
    }
  }
  async updateOptionProduct({ user_id, payload }: { user_id: string; payload: OptionProductUpdateReqBody }) {
    const optionProduct = await databaseService.optionproducts.findOne({
      product_id: new ObjectId(payload.product_id),
      size: Number(payload.size),
      color: payload.color
    })
    if (optionProduct) {
      throw new ErrorWithStatus({
        message: PRODUCTS_MESSAGES.OPTION_PRODUCT_EXISTS,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    } else {
      const result = await databaseService.optionproducts.findOneAndUpdate(
        {
          _id: new ObjectId(payload.optionProduct_id)
        },
        {
          $set: {
            size: Number(payload.size),
            color: payload.color,
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
    await databaseService.inventories.deleteMany({
      option_product_id: new ObjectId(optionProduct_id)
    })
    await databaseService.purchase_orders_items.deleteMany({
      option_product_id: new ObjectId(optionProduct_id)
    })
  }
  async exportFile({ product_ids, res }: { product_ids: string[]; res: Response }) {
    const filterProductIds = product_ids ? product_ids.map((id) => new ObjectId(id)) : []
    const products = await databaseService.products
      .aggregate([
        {
          $match: {
            _id: { $in: filterProductIds }
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
  async changeStatusProduct(payload: ChangeStatusProduct) {
    if (payload.status === StatusType.Active) {
      await databaseService.products.findOneAndUpdate(
        { _id: new ObjectId(payload.product_id) },
        {
          $set: {
            status: StatusType.Inactive,
            updated_at: new Date()
          }
        }
      )
    } else {
      await databaseService.products.findOneAndUpdate(
        { _id: new ObjectId(payload.product_id) },
        {
          $set: {
            status: StatusType.Active,
            updated_at: new Date()
          }
        }
      )
    }
  }
  async changeStatusOptionProduct(payload: ChangeStatusOptionProduct) {
    if (payload.status === StatusType.Active) {
      await databaseService.optionproducts.findOneAndUpdate(
        { _id: new ObjectId(payload.option_product_id) },
        {
          $set: {
            status: StatusType.Inactive,
            updated_at: new Date()
          }
        }
      )
    } else {
      await databaseService.optionproducts.findOneAndUpdate(
        { _id: new ObjectId(payload.option_product_id) },
        {
          $set: {
            status: StatusType.Active,
            updated_at: new Date()
          }
        }
      )
    }
  }
  async getAllStockOptionProductManagerById(option_product_id: string) {
    const [inventories, totalStock, totalSold] = await Promise.all([
      databaseService.inventories
        .aggregate([
          {
            $match: {
              option_product_id: new ObjectId(option_product_id)
            }
          },
          {
            $lookup: {
              from: 'option_products',
              localField: 'option_product_id',
              foreignField: '_id',
              as: 'option_product_id'
            }
          },
          { $unwind: '$option_product_id' },
          {
            $lookup: {
              from: 'users',
              localField: 'created_by',
              foreignField: '_id',
              as: 'created_by'
            }
          },
          { $unwind: '$created_by' },
          { $sort: { created_at: -1 } },
          {
            $project: {
              _id: 1,
              size: '$option_product_id.size',
              color: '$option_product_id.color',
              stock: 1,
              cost_price: 1,
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
        .toArray(),
      databaseService.inventories
        .aggregate([
          {
            $match: {
              option_product_id: new ObjectId(option_product_id)
            }
          },
          {
            $group: {
              _id: null,
              totalStock: { $sum: '$stock' }
            }
          }
        ])
        .toArray(),
      databaseService.inventories
        .aggregate([
          {
            $match: {
              option_product_id: new ObjectId(option_product_id)
            }
          },
          {
            $group: {
              _id: null,
              totalStock: { $sum: '$sold' }
            }
          }
        ])
        .toArray()
    ])

    return {
      inventories,
      totalStock: totalStock[0]?.totalStock || 0,
      totalSold: totalSold[0]?.totalStock || 0
    }
  }
}
const productsService = new ProductsSerice()
export default productsService
