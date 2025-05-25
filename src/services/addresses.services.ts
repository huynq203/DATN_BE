import { CreateAddressReqBody } from '~/models/requests/Address.requests'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'

class AddressesService {
  async getAddressByCustomerId(customer_id: string) {
    const result = await databaseService.addresses
      .find({ customer_id: new ObjectId(customer_id) })
      .sort({ created_at: -1 })
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
