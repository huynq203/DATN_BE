import { ObjectId } from 'mongodb'
interface RefreshTokenType {
  _id?: ObjectId
  token: string
  customer_id: ObjectId
  iat: number
  exp: number
  created_at?: Date
}
export default class RefreshToken {
  _id?: ObjectId
  token: string
  customer_id: ObjectId
  iat: number
  exp: number
  created_at: Date
  constructor(refreshtoken: RefreshTokenType) {
    this._id = refreshtoken._id || new ObjectId()
    this.token = refreshtoken.token
    this.customer_id = refreshtoken.customer_id
    this.iat = refreshtoken.iat
    this.exp = refreshtoken.exp
    this.created_at = refreshtoken.created_at || new Date()
  }
}
