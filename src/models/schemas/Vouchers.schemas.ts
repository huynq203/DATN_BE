import { ObjectId } from 'mongodb'
import { StatusType } from '~/constants/enums'

interface VoucherType {
  _id?: ObjectId
  name: string
  code: string
  discount: number
  quantity: number
  status?: StatusType
  time_start: Date
  time_end: Date
  created_by: ObjectId
  created_at?: Date
  updated_at?: Date
}

export class Voucher {
  _id: ObjectId
  name: string
  code: string
  discount: number
  quantity: number
  status: StatusType
  time_start: Date
  time_end: Date
  created_by: ObjectId
  created_at: Date
  updated_at: Date

  constructor(data: VoucherType) {
    this._id = data._id || new ObjectId()
    this.name = data.name
    this.code = data.code
    this.discount = data.discount
    this.quantity = data.quantity
    this.status = data.status || StatusType.Active
    this.time_start = data.time_start
    this.time_end = data.time_end
    this.created_by = data.created_by
    this.created_at = data.created_at || new Date()
    this.updated_at = data.updated_at || new Date()
  }
}
