import { hashPassword } from '~/utils/crypto'
import databaseService from './database.services'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import { RegisterReqBody, UpdateMeRequestBody } from '~/models/requests/Customer.requests'
import { signToken, verifyToken } from '~/utils/jwt'
import dotenv from 'dotenv'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { sendForgotPasswordEmail, sendVerifyRegisterEmail } from '~/utils/email'
import Customer from '~/models/schemas/Customer.schemas'
import { CUSTOMERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Error'
import axios from 'axios'
dotenv.config()
class CustomersService {
  //Khoi tao accesstoken
  private signAccessToken({ customer_id, verify }: { customer_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        customer_id,
        token_type: TokenType.AccessToken,
        verify
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  //Khoi tao refreshtoken
  private signRefreshToken({ customer_id, verify }: { customer_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        customer_id,
        token_type: TokenType.RefreshToken,
        verify
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }
  // Tạo accessToken và refreshToken
  private signAccessTokenAndRefreshToken({ customer_id, verify }: { customer_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ customer_id, verify }), this.signRefreshToken({ customer_id, verify })])
  }
  //Khoi tao token cho email khi xác thực
  private signEmailVerifyToken({ customer_id, verify }: { customer_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        customer_id,
        token_type: TokenType.EmailVerifyToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  // Khởi tạo token khi quên password
  private signFogotPasswordToken({ customer_id, verify }: { customer_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        customer_id,
        token_type: TokenType.ForgotPasswordToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  async checkEmailExist(email: string) {
    const result = await databaseService.customers.findOne({ email })
    return Boolean(result)
  }
  async checkPhoneExist(phone: string) {
    const result = await databaseService.customers.findOne({ phone })
    return Boolean(result)
  }

  //Lay access_token và id_token từ google
  private async getOauthGoogleToken(code: string) {
    console.log(code)

    const body = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }
    const { data } = await axios.post(`${process.env.GOOGLE_API_TOKEN}`, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return data as {
      access_token: string
      id_token: string
    }
  }

  //Lay thong tin customer tu google
  private async getGoogleUserInfo(access_token: string, id_token: string) {
    const { data } = await axios.get(`${process.env.GOOGLE_API_USERINFO}`, {
      params: {
        access_token,
        alt: 'json'
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })
    return data as {
      id: string
      email: string
      verified_email: boolean
      name: string
      given_name: string
      family_name: string
      picture: string
      locale: string
    }
  }

  async ouath(code: string) {
    const { access_token, id_token } = await this.getOauthGoogleToken(code)
    const userInfo = await this.getGoogleUserInfo(access_token, id_token)
    console.log('userInfo: ', userInfo)

    if (!userInfo.verified_email) {
      throw new ErrorWithStatus({
        message: CUSTOMERS_MESSAGES.GMAIL_NOT_VERIFIED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    //Kiem tra email đã được đăng ký hay chưa
    const customer = await databaseService.customers.findOne({ email: userInfo.email })
    //Nếu tồn tại cho login vào
    if (customer) {
      const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
        customer_id: customer._id.toString(),
        verify: customer.verify
      })
      const dedcodeRefreshToken = await verifyToken({ token: refresh_token })
      const { iat = 0, exp = 0 } = dedcodeRefreshToken
      //Insert refreshtoken va user_id vao db
      await databaseService.refreshTokens.insertOne(
        new RefreshToken({ token: refresh_token, customer_id: new ObjectId(customer._id), iat, exp })
      )
      return {
        access_token,
        refresh_token,
        newUser: 0
      }
    } else {
      const password = process.env.DEFAULT_PASSWORD as string
      const data = await this.register({
        email: userInfo.email,
        name: userInfo.name,
        password,
        confirm_password: password
      })

      return {
        ...data,
        newUser: 1
      }
    }
  }
  //Dang ky
  async register(payload: RegisterReqBody) {
    const customer_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      customer_id: customer_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    const result = await databaseService.customers.insertOne(
      new Customer({
        ...payload,
        email_verify_token,
        password: hashPassword(payload.password)
      })
    )
    const customer = await databaseService.customers.findOne(
      { _id: result.insertedId },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    //Khoi tao accesstoken va refreshtoken
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      customer_id: customer_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    const dedcodeRefreshToken = await verifyToken({ token: refresh_token })
    const { iat = 0, exp = 0 } = dedcodeRefreshToken
    //Insert refreshtoken va user_id vao db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ customer_id: new ObjectId(customer_id), token: refresh_token, iat, exp })
    )
    //Follow verify email
    // 1. Server send email to user
    // 2. User click link email
    // 3. Client send request to server with email_verify_token
    // 4. Server verify email_verify_token
    // 5. Client receive access_token and refresh_token
    await sendVerifyRegisterEmail(payload.email, email_verify_token)

    return {
      access_token,
      expires: process.env.ACCESS_TOKEN_EXPIRES_IN,
      customer: customer,
      refresh_token
    }
  }
  //Dang nhap
  async login({ customer_id, verify }: { customer_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      customer_id,
      verify
    })
    const dedcodeRefreshToken = await verifyToken({ token: refresh_token })
    const { iat, exp } = dedcodeRefreshToken
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        customer_id: new ObjectId(customer_id),
        iat: Number(iat),
        exp: Number(exp)
      })
    )
    const customer = await databaseService.customers.findOne(
      { _id: new ObjectId(customer_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return {
      access_token,
      refresh_token,
      expires: process.env.ACCESS_TOKEN_EXPIRES_IN,
      customer
    }
  }
  //Dang xuat
  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
  }

  async getMe(customer_id: string) {
    const customer = await databaseService.customers.findOne(
      { _id: new ObjectId(customer_id) },
      {
        // projection filter
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
          cart: 0,
          created_at: 0,
          updated_at: 0,
          role: 0,
          wishlist: 0
        }
      }
    )
    return customer
  }

  async updateMe(user_id: string, payload: UpdateMeRequestBody) {
    const customer = await databaseService.customers.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      [
        //Sử dụng thời gian 2
        {
          $set: {
            ...(payload as UpdateMeRequestBody),
            updated_at: '$$NOW'
          }
        }
      ],
      {
        returnDocument: 'after'
      }
    ) //Cập nhật giá trị mới và trả về giá trị mới
    return customer
  }
  //Khi ấn vào verify là chưa xác thực
  async resendVerifyEmail(customer_id: string) {
    //Khi gui email thi se tao ra mot token moi
    const email_verify_token = await this.signEmailVerifyToken({
      customer_id: customer_id,
      verify: UserVerifyStatus.Unverified
    })

    const customer = await databaseService.customers.findOne({ _id: new ObjectId(customer_id) })
    const email = customer?.email as string

    //Cập nhật lại giá trị email_verify_token trong document user
    await databaseService.customers.updateOne({ _id: new ObjectId(customer_id) }, [
      {
        $set: {
          email_verify_token,
          updated_at: '$$NOW'
        }
      }
    ])
    await sendVerifyRegisterEmail(email, email_verify_token)
  }
  // Sau khi ấn link thì sẽ xác thực
  async verifyEmail(customer_id: string) {
    //Tạo giá trị cập nhật
    //MongoDB cập nhật giá trị
    const [token] = await Promise.all([
      this.signAccessTokenAndRefreshToken({ customer_id, verify: UserVerifyStatus.Verified }),
      databaseService.customers.updateOne({ _id: new ObjectId(customer_id) }, [
        {
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified,
            updated_at: '$$NOW'
          }
        }
      ])
    ])
    const [access_token, refresh_token] = token
    const dedcodeRefreshToken = await verifyToken({ token: refresh_token })
    const { iat, exp } = dedcodeRefreshToken
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        customer_id: new ObjectId(customer_id),
        token: refresh_token,
        iat: Number(iat),
        exp: Number(exp)
      })
    )
    return {
      access_token,
      refresh_token
    }
  }

  //Quen mat khau
  async forgotPassword({
    customer_id,
    verify,
    email
  }: {
    customer_id: string
    verify: UserVerifyStatus
    email: string
  }) {
    console.log('customer_id', customer_id)
    console.log('verify', verify)
    console.log('email', email)

    const forgot_password_token = await this.signFogotPasswordToken({ customer_id, verify })
    console.log(forgot_password_token)

    await databaseService.customers.updateOne({ _id: new ObjectId(customer_id) }, [
      {
        $set: {
          forgot_password_token,
          updated_at: '$$NOW'
        }
      }
    ])
    //Gửi email kèm đường link đến email người dùng: http://localhost:3000/forgot-password?token=forgot_password_token
    await sendForgotPasswordEmail(email, forgot_password_token)
  }

  //Sau khi click trong mail
  async resetPassword(customer_id: string, password: string) {
    databaseService.customers.updateOne({ _id: new ObjectId(customer_id) }, [
      {
        $set: {
          forgot_password_token: '',
          password: hashPassword(password),
          updated_at: '$$NOW'
        }
      }
    ]) //Cập nhật giá trị mới và trả về giá trị mới
  }

  //Đổi password
  async changePassword(customer_id: string, new_password: string) {
    await databaseService.customers.findOneAndUpdate(
      { _id: new ObjectId(customer_id) },
      [
        {
          $set: {
            password: hashPassword(new_password),
            updated_at: '$$NOW'
          }
        }
      ],
      {
        returnDocument: 'after'
      }
    )
  }
}
const customersService = new CustomersService()
export default customersService
