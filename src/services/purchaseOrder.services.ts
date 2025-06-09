import { CreatePurchaseReq } from '~/models/requests/Product.requests'
import Inventory from '~/models/schemas/Inventories.schemas'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import PurchaseOrder from '~/models/schemas/PurchaseOrders.schemas'
import PurchaseOrderItem from '~/models/schemas/PurchaseOrderItems.schemas'

class PurchaseOrdersService {
  async createPurchaseOrder({ user_id, payload }: { user_id: string; payload: CreatePurchaseReq[] }) {
    payload.map(async (item) => {
      await databaseService.inventories.insertOne(
        new Inventory({
          option_product_id: new ObjectId(item.option_product_id),
          product_id: new ObjectId(item.product_id),
          stock: Number(item.stock),
          cost_price: Number(item.cost_price),
          created_by: new ObjectId(user_id)
        })
      )
      const purchase_order = await databaseService.purchase_orders.insertOne(
        new PurchaseOrder({
          total_price: Number(item.cost_price) * Number(item.stock),
          created_by: new ObjectId(user_id)
        })
      )
      await databaseService.purchase_orders_items.insertOne(
        new PurchaseOrderItem({
          purchase_order_id: new ObjectId(purchase_order.insertedId),
          option_product_id: new ObjectId(item.option_product_id),
          stock: Number(item.stock),
          cost_price: Number(item.cost_price),
          created_by: new ObjectId(user_id)
        })
      )
    })
  }
  async deletePurchaseOrder({ purchase_order_id }: { purchase_order_id: string }) {
    await databaseService.inventories.deleteOne({
      _id: new ObjectId(purchase_order_id)
    })
  }
}
const purchaseOrdersService = new PurchaseOrdersService()
export default purchaseOrdersService
