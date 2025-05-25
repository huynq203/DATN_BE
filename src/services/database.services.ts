import { Collection, Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Customer from '~/models/schemas/Customer.schemas'
import User from '~/models/schemas/User.schemas'
import Role from '~/models/schemas/Role.schemas'
import Address from '~/models/schemas/Addresses.schemas'
import Category from '~/models/schemas/Category.schema'
import Product from '~/models/schemas/Product.schema'
import Rating from '~/models/schemas/Rating.schemas'

import Order from '~/models/schemas/Orders.schemas'
import Cart from '~/models/schemas/Cart.schemas'
import OrderDetail from '~/models/schemas/OrderDetail.shemas'

import OptionProduct from '~/models/schemas/OptionProduct.schemas'
dotenv.config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@datn.phpnw.mongodb.net/?retryWrites=true&w=majority&appName=DATN`
class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Connect Database DATN Successfully!')
    } catch (error) {
      console.log('Error: ', error)
      throw error
    }
  }
  get customers(): Collection<Customer> {
    return this.db.collection(process.env.DB_CUSTOMERS_COLLECTION as string)
  }
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }
  get roles(): Collection<Role> {
    return this.db.collection(process.env.DB_ROLES_COLLECTION as string)
  }
  get addresses(): Collection<Address> {
    return this.db.collection(process.env.DB_ADDRESSES_COLLECTION as string)
  }
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }
  get categories(): Collection<Category> {
    return this.db.collection(process.env.DB_CATEGORIES_COLLECTION as string)
  }
  get products(): Collection<Product> {
    return this.db.collection(process.env.DB_PRODUCTS_COLLECTION as string)
  }
  get ratings(): Collection<Rating> {
    return this.db.collection(process.env.DB_RATINGS_COLLECTION as string)
  }

  get optionproducts(): Collection<OptionProduct> {
    return this.db.collection(process.env.DB_OPTION_PRODUCTS_COLLECTION as string)
  }
  get orders(): Collection<Order> {
    return this.db.collection(process.env.DB_ORDERS_COLLECTION as string)
  }
  get order_details(): Collection<OrderDetail> {
    return this.db.collection(process.env.DB_ORDER_DETAILS_COLLECTION as string)
  }
  get carts(): Collection<Cart> {
    return this.db.collection(process.env.DB_CARTS_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
