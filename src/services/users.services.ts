import { RoleType, StatusType, TokenType, UserVerifyStatus } from '~/constants/enums'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { signToken, verifyToken } from '~/utils/jwt'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import { hashPassword } from '~/utils/crypto'
import User from '~/models/schemas/User.schemas'
import { CreateUserReqBody, UpdateUserReqBody } from '~/models/requests/User.requests'
import { USERS_MESSAGES } from '~/constants/messages'

class UsersService {
  //Khoi tao accesstoken
  private signAccessToken({ user_id, role }: { user_id: string; role: string }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        role
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  //Khoi tao refreshtoken
  private signRefreshToken({ user_id, role }: { user_id: string; role: string }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        role
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }
  // Tạo accessToken và refreshToken
  private signAccessTokenAndRefreshToken({ user_id, role }: { user_id: string; role: string }) {
    return Promise.all([this.signAccessToken({ user_id, role }), this.signRefreshToken({ user_id, role })])
  }

  async checkEmailUserExist(email: string) {
    const result = await databaseService.users.findOne({ email })
    return Boolean(result)
  }
  async checkPhoneUserExist(phone: string) {
    const result = await databaseService.users.findOne({ phone })
    return Boolean(result)
  }

  //Dang nhap
  async loginUser({ user_id, role }: { user_id: string; role: string }) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id,
      role
    })
    const dedcodeRefreshToken = await verifyToken({ token: refresh_token })
    const { iat, exp } = dedcodeRefreshToken
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        customer_id: new ObjectId(user_id),
        iat: Number(iat),
        exp: Number(exp)
      })
    )
    const user = await databaseService.users
      .aggregate([
        {
          $match: { _id: new ObjectId(user_id) }
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'role'
          }
        },
        {
          $project: {
            name: 1,
            role: 1
          }
        }
      ])
      .toArray()

    return {
      access_token,
      refresh_token,
      user: user[0],
      role: user[0].role[0].role_name
    }
  }

  //Dang xuat
  async logoutUser(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
  }

  async getMeUser(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        // projection filter
        projection: {
          _id: 0,
          password: 0,
          created_at: 0,
          updated_at: 0,
          role: 0,
          created_by: 0
        }
      }
    )
    return user
  }

  async getAllUsers() {
    const result = await databaseService.users
      .aggregate([
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'role'
          }
        },
        {
          $unwind: {
            path: '$role'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'created_by',
            foreignField: '_id',
            as: 'created_by'
          }
        },
        {
          $unwind: {
            path: '$created_by'
          }
        },
        {
          $sort: {
            created_at: -1
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            phone: 1,
            date_of_birth: 1,
            address: 1,
            role: {
              _id: '$role._id',
              role_name: '$role.role_name'
            },
            created_by: {
              _id: '$created_by._id',
              name: '$created_by.name'
            },
            status: 1,
            created_at: 1,
            updated_at: 1
          }
        }
      ])
      .toArray()
    return result
  }

  async changeStatusUser({
    user_id,
    user_id_change,
    status
  }: {
    user_id: string
    user_id_change: string
    status: StatusType
  }) {
    if (status === StatusType.Active) {
      await databaseService.users.updateOne(
        {
          _id: new ObjectId(user_id_change)
        },
        [
          {
            $set: {
              status: StatusType.Inactive,
              created_by: new ObjectId(user_id),
              updated_at: '$$NOW'
            }
          }
        ]
      )
    } else {
      await databaseService.users.updateOne(
        {
          _id: new ObjectId(user_id_change)
        },
        [
          {
            $set: {
              status: StatusType.Active,
              created_by: new ObjectId(user_id),
              updated_at: '$$NOW'
            }
          }
        ]
      )
    }
  }

  //Tạo tài khoản user
  async createUser({ user_id, role_id, payload }: { user_id: string; role_id: string; payload: CreateUserReqBody }) {
    const user_role = await databaseService.roles.findOne({ _id: new ObjectId(role_id) })
    if (user_role?.role_name === RoleType.ADMIN) {
      const user = await databaseService.users.insertOne(
        new User({
          ...payload,
          password: hashPassword(process.env.DEFAULT_PASSWORD as string),
          role: new ObjectId(payload.role_id),
          created_by: new ObjectId(user_id)
        })
      )
      const result = await databaseService.users.findOne({ _id: user.insertedId })
      return {
        message: USERS_MESSAGES.CREATE_SUCCESS,
        result
      }
    } else {
      return {
        message: USERS_MESSAGES.YOU_NOT_HAVE_PERMISSION
      }
    }
  }
  async updateUser({ user_id, role_id, payload }: { user_id: string; role_id: string; payload: UpdateUserReqBody }) {
    const role = await databaseService.roles.findOne({ _id: new ObjectId(role_id) })
    if (role?.role_name === RoleType.ADMIN) {
      const result = await databaseService.users.updateOne(
        {
          _id: new ObjectId(payload.user_id_change)
        },
        [
          {
            $set: {
              name: payload.name,
              email: payload.email,
              phone: payload.phone,
              date_of_birth: payload.date_of_birth,
              address: payload.address,
              updated_at: '$$NOW',
              role: new ObjectId(payload.role_id),
              created_by: new ObjectId(user_id)
            }
          }
        ]
      )
      return result
    } else {
      throw new Error(USERS_MESSAGES.YOU_NOT_HAVE_PERMISSION)
    }
  }
}

const usersService = new UsersService()
export default usersService
