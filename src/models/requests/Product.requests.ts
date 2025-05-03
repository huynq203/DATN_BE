export interface ProductReqBody {
  category_id: string
  name: string
  description: string
  price: number
  sizes: string[]
}

export interface UpdateProductReqBody {
  name?: string
  description?: string
  price?: number
}
