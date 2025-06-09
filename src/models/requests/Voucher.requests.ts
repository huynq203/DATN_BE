export interface CreateVoucherReqBody {
  name: string
  code: string
  discount: number
  quantity: number
  time_start: Date
  time_end: Date
}

export interface UpdateVoucherReqBody {
  voucher_id: string
  name?: string
  code?: string
  discount?: number
  quantity?: number
  time_start?: Date
  time_end?: Date
}

export interface SaveVoucherReqBody {
  code: string
}
