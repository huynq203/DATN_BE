import { ObjectId } from 'mongodb'

interface PurchaseOrderType {
  _id?: ObjectId
  total_price: number
  created_by: ObjectId
  created_at?: Date
  updated_at?: Date
}

export default class PurchaseOrder {
  _id: ObjectId
  total_price: number
  created_by: ObjectId
  created_at?: Date
  updated_at?: Date

  constructor(purchaseOrder: PurchaseOrderType) {
    this._id = purchaseOrder._id || new ObjectId()
    this.total_price = purchaseOrder.total_price
    this.created_by = purchaseOrder.created_by
    this.created_at = purchaseOrder.created_at || new Date()
    this.updated_at = purchaseOrder.updated_at || new Date()
  }
}
