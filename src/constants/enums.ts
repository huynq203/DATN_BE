export enum TokenType {
  AccessToken, //0
  RefreshToken, // 1
  ForgotPasswordToken, //2
  EmailVerifyToken // 3
}

export enum UserVerifyStatus {
  Unverified, // Chưa xác thực email ,mặc định = 0
  Verified, // đã xác thực email 1
  Banned // bị khóa 2
}

export enum ProductStatus {
  Inactive, // không hiển thị 0
  Active // hiển thị 1
}

export enum RoleType {
  Admin = 'admin',
  Staff = 'staff'
}
export enum MediaType {
  Image, // 0
  Video // 1
}
