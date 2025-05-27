import { StatusType } from '~/constants/enums'

export interface CreateUserReqBody {
  name: string
  email: string
  phone: string
  date_of_birth: Date
  address: string
  role_id: string
}
export interface LoginUserReqBody {
  email: string
  password: string
}

export interface LogoutUserResBody {
  refresh_token: string
}

export interface UpdateUserReqBody {
  user_id_change: string
  name?: string
  email?: string
  phone?: string
  date_of_birth?: Date
  address?: string
  role_id?: string
}

export interface DeleteUserReqBody {
  user_id: string
}

export interface ChangeStatusUserReqBody {
  user_id_change: string
  status: StatusType
}
