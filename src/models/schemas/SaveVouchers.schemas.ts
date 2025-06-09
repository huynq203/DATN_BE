import { ObjectId } from 'mongodb'
import { IsUsed } from '~/constants/enums'

interface SaveVoucherType {
  _id?: ObjectId
  customer_id: ObjectId
  voucher_id: ObjectId
  is_used?: IsUsed
  created_at?: Date
  updated_at?: Date
}

export default class SaveVoucher {
  _id: ObjectId
  customer_id: ObjectId
  voucher_id: ObjectId
  is_used: IsUsed
  created_at: Date
  updated_at: Date

  constructor(saveVoucher: SaveVoucherType) {
    const date = new Date()
    this._id = saveVoucher._id || new ObjectId()
    this.customer_id = saveVoucher.customer_id
    this.voucher_id = saveVoucher.voucher_id
    this.is_used = saveVoucher.is_used || IsUsed.False
    this.created_at = saveVoucher.created_at || date
    this.updated_at = saveVoucher.updated_at || date
  }
}
