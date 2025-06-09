import { ObjectId } from 'mongodb'

interface PurchaseOrderItemType {
  _id?: ObjectId // ID của mục đơn hàng
  purchase_order_id: ObjectId // ID đơn hàng
  option_product_id: ObjectId // ID của sản phẩm tùy chọn (nếu có)
  stock: number // Số lượng sản phẩm trong đơn hàng
  cost_price: number // Giá của sản phẩm tại thời điểm nhập hàng
  created_by: ObjectId // Người tạo mục đơn hàng
  created_at?: Date // Ngày tạo mục đơn hàng
  updated_at?: Date // Ngày cập nhật mục đơn hàng
}

export default class PurchaseOrderItem {
  _id?: ObjectId // ID của mục đơn hàng
  purchase_order_id: ObjectId // ID đơn hàng
  option_product_id: ObjectId // ID của tùy chọn sản phẩm (nếu có)

  stock: number // Số lượng sản phẩm trong đơn hàng
  cost_price: number // Giá của sản phẩm tại thời điểm nhập hàng
  created_by: ObjectId // Người tạo mục đơn hàng
  created_at?: Date // Ngày tạo mục đơn hàng
  updated_at?: Date // Ngày cập nhật mục đơn hàng

  constructor(purchaseOrderItem: PurchaseOrderItemType) {
    this._id = purchaseOrderItem._id || new ObjectId()
    this.purchase_order_id = purchaseOrderItem.purchase_order_id
    this.option_product_id = purchaseOrderItem.option_product_id
    this.stock = purchaseOrderItem.stock
    this.cost_price = purchaseOrderItem.cost_price
    this.created_by = purchaseOrderItem.created_by
    this.created_at = purchaseOrderItem.created_at || new Date()
    this.updated_at = purchaseOrderItem.updated_at || new Date()
  }
}
