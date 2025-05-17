import { PaymentMethod, PaymentStatus } from '~/constants/enums'

export interface OrderReqBody {
  name: string
  phone: string
  address: string
  total_price: string
  payment_method: PaymentMethod
  payment_status?: PaymentStatus
  order_details: {
    product_id: string
    quantity: number
    size: number
    color: string
  }[]
}

export interface OrderReqQuery {
  vnp_Amount: string
  vnp_BankCode: string
  vnp_BankTranNo: string
  vnp_CardType: string
  vnp_OrderInfo: string
  vnp_PayDate: string
  vnp_ResponseCode: string
  vnp_TmnCode: string
  vnp_TransactionNo: string
  vnp_TransactionStatus: string
  vnp_TxnRef: string
  vnp_SecureHash?: string
}
