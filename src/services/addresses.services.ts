import { CreateAddressReqBody, UpdateAddressReqBody } from '~/models/requests/Address.requests'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import Address from '~/models/schemas/Addresses.schemas'
import { isDefault } from '~/constants/enums'

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
            updated_at: 1,
            isDefault: 1
          }
        }
      ])
      .toArray()
    return result
  }

  async getAddessDetail(address_id: string) {}

  async createAddress({ customer_id, payload }: { customer_id: string; payload: CreateAddressReqBody }) {
    const address = await databaseService.addresses.findOne({
      customer_id: new ObjectId(customer_id)
    })
    if (address) {
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
            isDefault: isDefault.False,
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
    } else {
      const result = await databaseService.addresses.insertOne(
        new Address({
          customer_id: new ObjectId(customer_id),
          address: payload.address,
          name: payload.name,
          phone: payload.phone,
          isDefault: isDefault.True,
          created_at: new Date(),
          updated_at: new Date()
        })
      )
      return result
    }
  }
  async updateAddress(payload: UpdateAddressReqBody) {
    const result = await databaseService.addresses.findOneAndUpdate(
      {
        _id: new ObjectId(payload.address_id)
      },
      {
        $set: {
          address: payload.address,
          name: payload.name,
          phone: payload.phone,
          updated_at: new Date()
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return result
  }
  async deleteAddressController(address_id: string) {
    await databaseService.addresses.deleteOne({
      _id: new ObjectId(address_id)
    })
  }
  async setDefaultAddress({ customer_id, address_id }: { customer_id: string; address_id: string }) {
    const result = await databaseService.addresses.updateMany(
      {
        customer_id: new ObjectId(customer_id)
      },
      {
        $set: {
          isDefault: isDefault.False
        }
      }
    )
    if (result.modifiedCount > 0) {
      const defaultAddress = await databaseService.addresses.findOneAndUpdate(
        {
          _id: new ObjectId(address_id),
          customer_id: new ObjectId(customer_id)
        },
        {
          $set: {
            isDefault: isDefault.True,
            updated_at: new Date()
          }
        },
        {
          returnDocument: 'after'
        }
      )
      return defaultAddress
    }
    return null
  }
}

const addressesService = new AddressesService()
export default addressesService
