export const VALIDATION_MESSAGES = {
  VALIDATION_ERROR: 'Validation error'
} as const

export const COMMONS_MESSAGES = {
  ACCESS_TOKEN_IS_REQUIRED: 'Access token không hợp lệ',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token không hợp lệ',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Refresh token đã được sử dụng hoặc không tồn tại',
  NAME_IS_REQUIRED: 'Tên không để trống',
  NAME_MUST_BE_A_STRING: 'Tên phải là một chuỗi',
  NAME_LENGTH_MUST_BE_FROM_1_TO_50: 'Độ dài tên từ 1 đến 50 ký tự',
  PASSWORD_IS_REQUIRED: 'Mật khẩu không để trống',
  PASSWORD_MUST_BE_A_STRING: 'Mật khẩu phải là một chuỗi',
  PASSWORD_LENGHT_MUST_BE_FROM_6_to_50: 'Độ dài mật khẩu từ 6 đến 50 ký tự',
  PASSWORD_MUST_BE_STRONG: 'Mật khẩu phải mạnh',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Mật khẩu xác nhận không để trống',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Mật khẩu xác nhận phải là một chuỗi',
  CONFRIM_PASSWORD_LENGTH_MUST_BE_FROM_6: 'Độ dài mật khẩu xác nhận từ 6 ký tự',
  CONFIRM_PASSWORD_MUST_BE_STRONG: 'Mật khẩu xác nhận phải mạnh',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: ' Mật khẩu xác nhận không khớp với mật khẩu',
  DATE_OF_BIRTH_MUST_BE_ISO8601: ' Ngày sinh không hợp lệ',
  EMAIL_IS_INVALID: 'Email không hợp lệ',
  EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',
  PHONE_IS_REQUIRED: 'Số điện thoại không để trống',
  PHONE_IS_INVALID: 'Số điện thoại không hợp lệ',
  PHONE_IS_EXISTS: 'Số điện thoại đã tồn tại',
  EMAIL_IS_INCORRECT: 'Email không tồn tại',
  PASS_IS_INCORRECT: 'Mật khẩu không đúng',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email hoặc mật khẩu không đúng',
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  LOGOUT_SUCCESS: 'Đăng xuất thành công'
} as const

export const CUSTOMERS_MESSAGES = {
  REGISTER_SUCCESS: 'Đăng ký thành công',
  CUSTOMER_NOT_FOUND: 'Khách hàng không tồn tại',
  EMAIL_ALREADY_VERIFED_BEFORE: 'Email đã được xác thực trước đó',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Gửi email xác thực thành công',
  EMAIL_VERIFY_TOKEN_IS_INVALID: 'Email verify token không hợp lệ',
  EMAIL_VERIFY_SUCCESS: 'Xác thực email thành công',
  CUSTOMER_NOT_VERIFIED: 'Khách hàng chưa xác thực Email',
  UPDATE_ME_SUCCESS: 'Cập nhật thông tin thành công',
  EMAIL_IS_INVALID: 'Email không hợp lệ',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Vui lòng kiểm tra email để đặt lại mật khẩu',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token không hợp lệ',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Forgot password token không hợp lệ',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Xác thực quên mật khẩu thành công',
  PASSWORD_IS_REQUIRED: ' Mật khẩu không để trống',
  PASSWORD_MUST_BE_A_STRING: 'Mật khẩu phải là một chuỗi',
  PASSWORD_LENGHT_MUST_BE_FROM_6_to_50: 'Độ dài mật khẩu từ 6 đến 50 ký tự',
  PASSWORD_MUST_BE_STRONG: ' Mật khẩu phải mạnh',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Mật khẩu xác nhận không để trống',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Mật khẩu xác nhận phải là một chuỗi',
  CONFRIM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Độ dài mật khẩu xác nhận từ 6 đến 50 ký tự',
  CONFIRM_PASSWORD_MUST_BE_STRONG: 'Mật khẩu xác nhận phải mạnh',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Mật khẩu xác nhận không khớp với mật khẩu',
  RESET_PASSWORD_SUCCESS: 'Đặt lại mật khẩu thành công',
  OLD_PASSWORD_NOT_MATCH: 'Mật khẩu cũ không đúng',
  CHANGE_PASSWORD_SUCCESS: 'Đổi mật khẩu thành công',
  GET_ME_SUCCESS: 'Thông tin tài khoản thành công',
  GMAIL_NOT_VERIFIED: 'Email chưa được xác thực'
} as const

export const USERS_MESSAGES = {
  CREATE_SUCCESS: 'Tạo người dùng thành công',
  UPDATE_PROFILE_SUCCESS: 'Cập nhật thông tin thành công'
} as const

export const ROLES_MESSAGES = {
  CREATE_SUCCESS: 'Tạo vai trò thành công',
  UPDATE_SUCCESS: 'Cập nhật vai trò thành công',
  DELETE_SUCCESS: 'Xóa vai trò thành công',
  ROLENAME_IS_REQUIRED: 'Vai trò không để trống',
  ROLENAME_MUST_BE_A_STRING: 'Vai trò phải là một chuỗi',
  DESCRIPTION_IS_REQUIRED: 'Mô tả không để trống'
} as const

export const ADDRESSES_MESSAGES = {
  CREATE_SUCCESS: 'Tạo địa chỉ thành công',
  UPDATE_SUCCESS: 'Cập nhật địa chỉ thành công',
  DELETE_SUCCESS: 'Xóa địa chỉ thành công',
  ADDRESS_NOT_FOUND: 'Địa chỉ không tồn tại',
  ADDRESS_IS_REQUIRED: 'Địa chỉ không để trống'
} as const
