import { CartStatus, OrderStatus, PaymentMethod, PaymentStatus, VnPayStatus } from '~/constants/enums'
import { OrderReqBody, OrderReqQuery } from '~/models/requests/Order.requests'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import Order from '~/models/schemas/Orders.schemas'
import OrderDetail from '~/models/schemas/OrderDetail.shemas'
import qs from 'qs'
import crypto from 'crypto'
import moment from 'moment'
import { sortObject } from '~/utils/utils'
import { config } from 'dotenv'
import { sendOrder } from '~/utils/email'
config()
class OrdersService {
  sortObject(obj: Record<string, string>) {
    const sorted: Record<string, string> = {}
    const keys = Object.keys(obj).sort()
    for (const key of keys) {
      sorted[key] = obj[key]
    }
    return sorted
  }

  async createOrderCOD({ customer_id, payload }: { customer_id: string; payload: OrderReqBody }) {
    const order = await databaseService.orders.insertOne(
      new Order({
        customer_id: new ObjectId(customer_id),
        address: payload.address,
        order_status: OrderStatus.Pending,
        payment_method: payload.payment_method,
        payment_status: PaymentStatus.Unpaid,
        total_price: Number(payload.total_price)
      })
    )
    await Promise.all(
      payload.order_details.map((item) => {
        return databaseService.order_details.insertOne(
          new OrderDetail({
            order_id: order.insertedId,
            product_id: new ObjectId(item.product_id),
            quantity: Number(item.quantity),
            size: Number(item.size),
            color: item.color
          })
        )
      })
    )

    if (order) {
      await Promise.all([
        ...payload.order_details.map((item) => {
          return databaseService.carts.updateOne(
            {
              _id: new ObjectId(item.cart_id)
            },
            {
              $set: {
                status: CartStatus.Completed,
                updated_at: new Date()
              }
            }
          )
        }),
        ...payload.order_details.map((item) => {
          return databaseService.optionproducts.findOneAndUpdate(
            {
              product_id: new ObjectId(item.product_id),
              color: item.color,
              size: item.size
            },
            {
              $inc: { stock: -Number(item.quantity) },
              $set: { updated_at: new Date() }
            }
          )
        })
      ])
    }
  }
  // async createOrderMomo({ customer_id, payload }: { customer_id: string; payload: OrderReqBody }) {}

  async createOrderVnPay({ customer_id, payload, ip }: { customer_id: string; payload: OrderReqBody; ip: string }) {
    const order = await databaseService.orders.insertOne(
      new Order({
        customer_id: new ObjectId(customer_id),
        address: payload.address,
        order_status: OrderStatus.Pending,
        payment_method: payload.payment_method,
        payment_status: PaymentStatus.Unpaid,
        total_price: Number(payload.total_price)
      })
    )
    await Promise.all(
      payload.order_details.map((item) => {
        return databaseService.order_details.insertOne(
          new OrderDetail({
            order_id: order.insertedId,
            product_id: new ObjectId(item.product_id),
            cart_id: new ObjectId(item.cart_id),
            quantity: Number(item.quantity),
            size: Number(item.size),
            color: item.color
          })
        )
      })
    )
    const date = new Date()
    const createDate = moment(date).format('YYYYMMDDHHmmss')
    const amount = Number(payload.total_price)
    const tmnCode = process.env.VNP_TMN_CODE as string // Lấy từ VNPay .env
    const secretKey = process.env.VNP_HASH_SECRET as string // Lấy từ VNPay
    const returnUrl = process.env.VNP_RETURN_URL as string // Trang kết quả
    const vnp_Url = process.env.VNP_URL as string // Trang thanh toán của VNPay
    const ipAddr = ip
    // Logic sẽ nằm ở đây khi tạo đơn hàng
    const bankCode = 'NCB'
    const orderInfo = 'Thanh_toan_don_hang'
    const locale = 'vn'
    const currCode = 'VND'
    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: order.insertedId.toString(),
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'billpayment',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_BankCode: bankCode
    }
    const stringified_vnpParams = Object.fromEntries(
      Object.entries(vnp_Params).map(([key, value]) => [key, String(value)])
    )
    const sort_vnpParams = sortObject(stringified_vnpParams)
    const signData = qs.stringify(sort_vnpParams)
    const hmac = crypto.createHmac('sha512', secretKey)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
    sort_vnpParams['vnp_SecureHash'] = signed
    const paymentUrl = vnp_Url + '?' + qs.stringify(sort_vnpParams)
    return paymentUrl
  }
  async returnOrderVnPay({ customer_id, payload }: { customer_id: string; payload: OrderReqQuery }) {
    const order_id = payload.vnp_TxnRef
    const order = await databaseService.orders
      .aggregate<OrderReqBody>([
        {
          $match: {
            _id: new ObjectId(order_id),
            customer_id: new ObjectId(customer_id)
          }
        },
        {
          $lookup: {
            from: 'order_details',
            localField: '_id',
            foreignField: 'order_id',
            as: 'order_details'
          }
        }
      ])
      .toArray()
    const customer = await databaseService.customers.findOne({
      _id: new ObjectId(customer_id)
    })
    const vnp_SecureHash = payload?.vnp_SecureHash
    const secretKey = process.env.VNP_HASH_SECRET as string
    delete payload.vnp_SecureHash
    const signData = qs.stringify(payload)
    const hmac = crypto.createHmac('sha512', secretKey)
    const checkSum = hmac.update(signData).digest('hex')
    if (checkSum === vnp_SecureHash) {

      if (payload.vnp_ResponseCode === VnPayStatus.Success) {
        await Promise.all([
          ...order[0].order_details.map((item) => {
            return databaseService.carts.updateOne(
              {
                _id: new ObjectId(item.cart_id)
              },
              [
                {
                  $set: {
                    status: CartStatus.Completed,
                    updated_at: '$$NOW'
                  }
                }
              ]
            )
          }),
          ...order[0].order_details.map((item) => {
            return databaseService.optionproducts.findOneAndUpdate(
              {
                product_id: new ObjectId(item.product_id),
                color: item.color,
                size: item.size
              },
              {
                $inc: { stock: -Number(item.quantity) },
                $set: { updated_at: new Date() }
              }
            )
          }),
          databaseService.orders.updateOne(
            {
              _id: new ObjectId(order_id)
            },
            [
              {
                $set: {
                  payment_status: PaymentStatus.Paid,
                  updated_at: '$$NOW'
                }
              }
            ]
          ),
          sendOrder(customer?.email as string, order[0]?._id as string)
        ])
      } else if (payload.vnp_ResponseCode === VnPayStatus.Cancel) {
        await Promise.all([
          ...order[0].order_details.map((item) => {
            return databaseService.carts.updateOne(
              {
                _id: new ObjectId(item.cart_id)
              },
              {
                $set: {
                  status: CartStatus.Canceled,
                  updated_at: new Date()
                }
              }
            )
          }),
          databaseService.orders.updateOne(
            {
              _id: new ObjectId(order_id)
            },
            [
              {
                $set: {
                  order_status: OrderStatus.Canceled,
                  updated_at: '$$NOW'
                }
              }
            ]
          )
        ])
      }
      return {
        check: true,
        payment_method: PaymentMethod.VNPAY
      }
    }
    return { check: false }
  }
}
const ordersService = new OrdersService()
export default ordersService
