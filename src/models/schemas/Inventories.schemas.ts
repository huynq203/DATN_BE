import { ObjectId } from 'mongodb'
import { StatusType } from '~/constants/enums'

interface InventoryType {
  _id?: ObjectId // ID của kho hàng
  option_product_id: ObjectId // ID của tùy chọn sản phẩm
  product_id: ObjectId // ID của sản phẩm
  stock: number // Số lượng hàng tồn kho
  cost_price: number // Giá nhập kho của sản phẩm
  sold?: number // Số lượng đã bán
  status?: StatusType
  created_by: ObjectId // Người tạo kho hàng
  created_at?: Date // Ngày tạo kho hàng
  updated_at?: Date // Ngày cập nhật kho hàng
}

export default class Inventory {
  _id: ObjectId // ID của kho hàng
  option_product_id: ObjectId // ID của tùy chọn sản phẩm
  product_id: ObjectId // ID của sản phẩm (có thể được thêm vào nếu cần thiết)
  stock: number // Số lượng hàng tồn kho
  cost_price: number // Giá nhập kho của sản phẩm
  sold: number // Số lượng đã bán
  status: StatusType
  created_by: ObjectId // Người tạo kho hàng
  created_at: Date // Ngày tạo kho hàng
  updated_at: Date // Ngày cập nhật kho hàng

  constructor(inventory: InventoryType) {
    const date = new Date()
    this._id = inventory._id || new ObjectId()
    this.option_product_id = inventory.option_product_id
    this.product_id = inventory.product_id // Thêm product_id nếu cần thiết
    this.stock = inventory.stock
    this.cost_price = inventory.cost_price
    this.sold = inventory.sold || 0
    this.status = inventory.status || StatusType.Active
    this.created_by = inventory.created_by
    this.created_at = inventory.created_at || date
    this.updated_at = inventory.updated_at || date
  }
}
