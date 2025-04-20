import { Request } from 'express'
import { TokenPayload } from './models/requests/Customer.requests'
import Customer from './models/schemas/Customer.schemas'
import User from './models/schemas/User.schemas'
declare module 'express' {
  interface Request {
    customer?: Customer
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_password_verify_token?: TokenPayload
  }
}
