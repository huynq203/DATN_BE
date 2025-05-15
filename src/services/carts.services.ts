import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Cart from '~/models/schemas/Cart.schemas'
import { CartDeleteReqBody, CartReqBody } from '~/models/requests/Cart.requests'
import { CartStatus } from '~/constants/enums'

class CartsService {
  async getCartsByCustomerId({ customer_id, status }: { customer_id: string; status: CartStatus }) {
    const [carts, total] = await Promise.all([
      databaseService.carts
        .aggregate([
          {
            $match: { customer_id: new ObjectId(customer_id), status }
          },
          {
            $lookup: {
              from: 'products',
              localField: 'product_id',
              foreignField: '_id',
              as: 'product_id'
            }
          },
          {
            $unwind: '$product_id'
          },
          {
            $project: {
              'product_id.description': 0,
              'product_id.created_by': 0,
              'product_id.created_at': 0,
              'product_id.updated_at': 0,
              'product_id.view': 0,
              'product_id.sold': 0,
              'product_id.status': 0,
              'product_id.sizes': 0
            }
          },
          { $sort: { created_at: -1 } }
        ])
        .toArray(),
      databaseService.carts
        .aggregate([
          {
            $match: { customer_id: new ObjectId(customer_id), status }
          },
          {
            $lookup: {
              from: 'products',
              localField: 'product_id',
              foreignField: '_id',
              as: 'product_id'
            }
          },
          {
            $unwind: '$product_id'
          },
          {
            $project: {
              'product_id.description': 0,
              'product_id.slug': 0,
              'product_id.created_by': 0,
              'product_id.created_at': 0,
              'product_id.updated_at': 0,
              'product_id.view': 0,
              'product_id.sold': 0,
              'product_id.stock': 0,
              'product_id.status': 0,
              'product_id.sizes': 0
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])
    return {
      carts,
      total: total[0]?.total || 0
    }
  }
  async addToCart({ customer_id, payload }: { customer_id: string; payload: CartReqBody }) {
    const findCart = await databaseService.carts.findOne({
      customer_id: new ObjectId(customer_id),
      product_id: new ObjectId(payload.product_id),
      color: payload.color,
      size: payload.size,
      status: CartStatus.InCart
    })
    if (findCart) {
      const result = await databaseService.carts.findOneAndUpdate(
        {
          customer_id: new ObjectId(customer_id),
          product_id: new ObjectId(payload.product_id),
          size: payload.size,
          color: payload.color
        },
        {
          $inc: {
            quantity: payload.quantity
          },
          $set: {
            updated_at: new Date()
          }
        },
        { returnDocument: 'after' }
      )
      return result
    } else {
      const cart = await databaseService.carts.insertOne(
        new Cart({
          customer_id: new ObjectId(customer_id),
          ...payload,
          product_id: new ObjectId(payload.product_id)
        })
      )
      const result = await databaseService.carts.findOne({ _id: cart.insertedId })

      return result
    }
  }
  async updateCart({ customer_id, payload }: { customer_id: string; payload: CartReqBody }) {
    const findCart = await databaseService.carts.findOne({
      customer_id: new ObjectId(customer_id),
      product_id: new ObjectId(payload.product_id),
      color: payload.color,
      size: payload.size
    })
    if (findCart) {
      const result = await databaseService.carts.findOneAndUpdate(
        {
          customer_id: new ObjectId(customer_id),
          product_id: new ObjectId(payload.product_id),
          size: payload.size,
          color: payload.color
        },
        {
          $set: {
            quantity: payload.quantity,
            updated_at: new Date()
          }
        },
        { returnDocument: 'after' }
      )
      return result
    } else {
      const cart = await databaseService.carts.insertOne(
        new Cart({
          customer_id: new ObjectId(customer_id),
          ...payload,
          product_id: new ObjectId(payload.product_id)
        })
      )
      const result = await databaseService.carts.findOne({ _id: cart.insertedId })
      return result
    }
  }
  async deleteCart({ customer_id, product_ids }: { customer_id: string; product_ids: CartDeleteReqBody[] }) {
    const result = await databaseService.carts.deleteMany({
      $or: product_ids.map((item) => ({
        customer_id: new ObjectId(customer_id),
        product_id: new ObjectId(item.product_id),
        color: item.color,
        size: item.size
      }))
    })

    return result
  }
  //Tạm thời bỏ
  // async buyProducts({ customer_id, payload }: { customer_id: string; payload: CartReqBody }) {
  //   console.log(customer_id)
  //   console.log(payload)
  // }
}

const cartsService = new CartsService()
export default cartsService
