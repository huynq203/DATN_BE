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
  ADMIN = 'admin',
  STAFF = 'staff'
}
export enum MediaType {
  Image, // 0
  Video // 1
}

export enum OrderStatus {
  Pending, // Đang chờ xử lý - 1
  Confirmed, // Đã xác nhận - 2
  Processing, // Đang xử lý - 3
  Shipping, // Đang giao hàng - 4
  Completed, // Đã giao hàng - 5
  Canceled // Đã hủy - 6
}

export enum PaymentStatus {
  Unpaid, // Chưa thanh toán - 0
  Paid // Đã thanh toán - 1
}

export enum PaymentMethod {
  COD, // 0 Thanh toán khi nhận hàng
  MOMO, // 1 Thanh toán qua thẻ: MOMO
  VNPAY // 2 Thanh toán qua thẻ: VNPAY
}

export enum CartStatus {
  InCart, // Đã thêm vào giỏ hàng - 0
  Completed, // Đã mua - 1
  Canceled // Đã hủy - 2
}

export enum VnPayStatus {
  Success = '00',
  Cancel = '24'
}

export enum StatusType {
  Inactive,
  Active
}
