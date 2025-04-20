export enum TokenType {
  AccessToken, //0
  RefreshToken, // 1
  ForgotPasswordToken, //2
  EmailVerifyToken // 3
}

export enum RoleType {
  Admin, //0
  Staff, //1
  Customer // 2
}

export enum UserVerifyStatus {
  Unverified, // Chưa xác thực email ,mặc định = 0
  Verified, // đã xác thực email 1
  Banned // bị khóa 2
}

