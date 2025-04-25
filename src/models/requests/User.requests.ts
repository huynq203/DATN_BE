export interface CreateUserReqBody {
  name: string
  email: string
  phone: string
  date_of_birth: Date
  address: string
  role: string
  created_by: string
  password: string
  confirm_password: string
}
export interface LoginUserReqBody {
  email: string
  password: string
}

export interface LogoutUserResBody {
  refresh_token: string
}

export interface UpdateUserReqBody {
  user_id: string
  name?: string
  email?: string
  phone?: string
  date_of_birth?: Date
  address?: string
}

export interface DeleteUserReqBody {
  user_id: string
}
