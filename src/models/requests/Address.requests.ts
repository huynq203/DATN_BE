export interface CreateAddressReqBody {
  name: string
  phone: string
  address: string
}

export interface UpdateAddressReqBody {
  address_id: string
  name: string
  phone: string
  address: string
}
