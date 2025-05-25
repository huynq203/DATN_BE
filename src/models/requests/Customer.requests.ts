import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}

export interface RegisterReqBody {
  name: string
  email: string
  phone?: string
  password: string
  confirm_password: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface VerifyEmailReqBody {
  email_verify_token: string
}

export interface UpdateProfileRequestBody {
  name?: string
  phone?: string
  date_of_birth?: Date
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface verifyForgotPasswordReqBody {
  forgot_password_token: string
}

export interface resetPassword {
  password: string
}

export interface ChangePasswordReqBody {
  old_password: string
  new_password: string
  confirm_new_password: string
}
