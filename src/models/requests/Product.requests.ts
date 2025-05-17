export interface ProductReqBody {
  category_id: string
  name: string
  description: string
  price: number
  stock: number
  color: string
  size: number
}

export interface UpdateProductReqBody {
  name?: string
  description?: string
  price?: number
}
