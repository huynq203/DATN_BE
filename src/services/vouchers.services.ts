import { CreateVoucherReqBody, UpdateVoucherReqBody } from '~/models/requests/Voucher.requests'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import { IsUsed, StatusType } from '~/constants/enums'
import { Voucher } from '~/models/schemas/Vouchers.schemas'
import SaveVoucher from '~/models/schemas/SaveVouchers.schemas'

class VouchersService {
  async getAllVouchers() {
    const result = await databaseService.vouchers
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
          $sort: {
            created_at: -1
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            code: 1,
            discount: 1,
            quantity: 1,
            status: 1,
            time_start: 1,
            time_end: 1,
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
  async createVoucher({ user_id, payload }: { user_id: string; payload: CreateVoucherReqBody }) {
    const result = await databaseService.vouchers.insertOne(
      new Voucher({
        ...payload,
        created_by: new ObjectId(user_id),
        time_start: new Date(payload.time_start),
        time_end: new Date(payload.time_end),
        discount: Number(payload.discount),
        quantity: Number(payload.quantity)
      })
    )
    return result
  }
  async updateVoucherStatus() {
    const currentDate = new Date()
    const result = await databaseService.vouchers.updateMany(
      {
        time_end: { $lt: currentDate },
        status: StatusType.Active
      },
      [
        {
          $set: {
            status: StatusType.Inactive,
            updated_at: '$$NOW'
          }
        }
      ]
    )
    return result
  }
  async updateVoucher({ user_id, payload }: { user_id: string; payload: UpdateVoucherReqBody }) {
    const result = await databaseService.vouchers.findOneAndUpdate(
      {
        _id: new ObjectId(payload.voucher_id)
      },
      [
        {
          $set: {
            name: payload.name,
            code: payload.code,
            discount: Number(payload.discount),
            quantity: Number(payload.quantity),
            time_start: new Date(payload.time_start as Date),
            time_end: new Date(payload.time_end as Date),
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
  async deleteVoucher(voucher_id: string) {
    await databaseService.vouchers.deleteOne({
      _id: new ObjectId(voucher_id)
    })
  }
  async saveVoucher({ customer_id, code }: { customer_id: string; code: string }) {
    const voucher = await databaseService.vouchers.findOne({ code, status: StatusType.Active })
    await databaseService.saveVoucher.findOneAndUpdate(
      {
        customer_id: new ObjectId(customer_id),
        voucher_id: new ObjectId(voucher?._id)
      },
      {
        $setOnInsert: {
          customer_id: new ObjectId(customer_id),
          voucher_id: new ObjectId(voucher?._id),
          is_used: IsUsed.False,
          created_at: new Date(),
          updated_at: new Date()
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return voucher?.discount
  }
}

const vouchersService = new VouchersService()
export default vouchersService
