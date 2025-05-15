import { CartStatus } from '~/constants/enums'

export interface CartReqBody {
  product_id: string
  quantity: number
  size: number
  color: string
  status: CartStatus
}

export interface CartDeleteReqBody {
  product_id: string
  size: number
  color: string
}
