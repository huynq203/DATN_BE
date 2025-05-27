import { CreateAddressReqBody } from '~/models/requests/Address.requests'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'

class AddressesService {
  async getAllAddress() {
    const result = await databaseService.addresses
      .aggregate([
        {
          $lookup: {
            from: 'customers',
            localField: 'customer_id',
            foreignField: '_id',
            as: 'customer_id'
          }
        },
        {
          $unwind: {
            path: '$customer_id'
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            phone: 1,
            address: 1,
            customer_id: {
              _id: '$customer_id._id',
              name: '$customer_id.name',
              phone: '$customer_id.phone'
            },
            created_at: 1,
            updated_at: 1
          }
        }
      ])
      .toArray()
    console.log(result)

    return result
  }
  async getAddressbyCustomer(customer_id: string) {
    const result = await databaseService.addresses
      .aggregate([
        {
          $match: {
            customer_id: new ObjectId(customer_id)
          }
        },
        {
          $lookup: {
            from: 'customers',
            localField: 'customer_id',
            foreignField: '_id',
            as: 'customer_id'
          }
        },
        {
          $unwind: {
            path: '$customer_id'
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            phone: 1,
            address: 1,
            customer_id: {
              _id: '$customer_id._id',
              name: '$customer_id.name',
              phone: '$customer_id.phone'
            },
            created_at: 1,
            updated_at: 1
          }
        }
      ])
      .toArray()
    return result
  }
  async createAddress({ customer_id, payload }: { customer_id: string; payload: CreateAddressReqBody }) {
    const result = await databaseService.addresses.findOneAndUpdate(
      {
        customer_id: new ObjectId(customer_id),
        address: payload.address,
        name: payload.name,
        phone: payload.phone
      },
      {
        $setOnInsert: {
          customer_id: new ObjectId(customer_id),
          address: payload.address,
          name: payload.name,
          phone: payload.phone,
          created_at: new Date(),
          updated_at: new Date()
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return result
  }
}

const addressesService = new AddressesService()
export default addressesService
