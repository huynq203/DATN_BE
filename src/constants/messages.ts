import { DES } from 'crypto-js'

export const JWT_MESSAGES = {
  JWT_EXPRIED: 'JWT hết hạn'
} as const

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
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  USER_IS_LOCKED: 'Tài khoản đã bị khóa, Yêu cầu liên hệ admin để mở tài khoản'
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
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Vui lòng kiểm tra hộp thư email để đặt lại mật khẩu',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Token không hợp lệ',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Token không hợp lệ',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Xác thực token thành công',
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
  GMAIL_NOT_VERIFIED: 'Email chưa được xác thực',
  EMAIL_NOT_FOUND: 'Email không tồn tại',
  GET_ALL_CUSTOMERS_SUCCESS: 'Lấy danh sách người dùng thành công',
  GET_CUSTOMER_BY_ID_SUCCESS: 'Lấy thông tin người dùng thành công',
  USER_NOT_FOUND: 'Người dùng không tồn tại',
  UPDATE_CUSTOMER_SUCCESS: 'Cập nhật thông tin người dùng thành công',
  DELETE_CUSTOMER_SUCCESS: 'Xóa người dùng thành công',
  CUSTOMER_IS_LOCKED: 'Tài khoản đã bị khóa, Yêu cầu liên hệ admin để mở tài khoản',
  CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái người dùng thành công',
  EXPORT_FILE_CUSTOMER_SUCCESS: 'Xuất file người dùng thành công'
} as const

export const USERS_MESSAGES = {
  GET_ALL_USERS_SUCCESS: 'Lấy danh sách người dùng thành công',
  GET_USER_BY_ID_SUCCESS: 'Lấy thông tin người dùng thành công',
  CREATE_SUCCESS: 'Tạo người dùng thành công',
  UPDATE_PROFILE_SUCCESS: 'Cập nhật thông tin thành công',
  DELETE_SUCCESS: 'Xóa người dùng thành công',
  YOU_NOT_HAVE_PERMISSION: 'Bạn không có quyền thực hiện hành động này',
  CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái người dùng thành công'
} as const

export const ROLES_MESSAGES = {
  CREATE_SUCCESS: 'Tạo vai trò thành công',
  UPDATE_SUCCESS: 'Cập nhật vai trò thành công',
  DELETE_SUCCESS: 'Xóa vai trò thành công',
  ROLENAME_IS_REQUIRED: 'Vai trò không để trống',
  ROLENAME_MUST_BE_A_STRING: 'Vai trò phải là một chuỗi',
  DESCRIPTION_IS_REQUIRED: 'Mô tả không để trống',
  GET_ALL_ROLE: 'Lấy danh sách vai trò thành công'
} as const

export const ADDRESSES_MESSAGES = {
  CREATE_SUCCESS: 'Tạo địa chỉ thành công',
  UPDATE_SUCCESS: 'Cập nhật địa chỉ thành công',
  DELETE_SUCCESS: 'Xóa địa chỉ thành công',
  ADDRESS_NOT_FOUND: 'Địa chỉ không tồn tại',
  ADDRESS_IS_REQUIRED: 'Địa chỉ không để trống',
  GET_ADDRESS_SUCCESS: 'Lấy địa chỉ thành công'
} as const

export const CATEGORIES_MESSAGES = {
  GET_CATEGORY_SUCCESS: 'Lấy danh mục thành công',
  GET_CATEGORY_BY_ID_SUCCESS: 'Lấy danh mục theo id thành công',
  CREATE_SUCCESS: 'Tạo danh mục thành công',
  UPDATE_SUCCESS: 'Cập nhật danh mục thành công',
  DELETE_SUCCESS: 'Xóa danh mục thành công',
  CATEGORIES_NOT_FOUND: 'Danh mục không tồn tại',
  NAME_IS_REQUIRED: 'Tên danh mục không để trống',
  NAME_MUST_BE_A_STRING: 'Tên danh mục phải là một chuỗi',
  DESCRIPTION_IS_REQUIRED: 'Mô tả không để trống',
  DESCRIPTION_MUST_BE_A_STRING: 'Mô tả phải là một chuỗi',
  SLUG_IS_REQUIRED: 'Slug không để trống',
  SLUG_MUST_BE_A_STRING: 'Slug phải là một chuỗi'
} as const

export const PRODUCTS_MESSAGES = {
  CATEGORY_ID_REQUIRED: 'Danh mục không để trống',
  NAME_REQUIRED: 'Tên sản phẩm không để trống',
  DESCRIPTION_REQUIRED: 'Mô tả không để trống',
  PRICE_REQUIRED: 'Giá không để trống',
  PRICE_MUST_BE_A_NUMBER: 'Giá phải là một số',
  PRICE_MUST_BE_A_POSITIVE_NUMBER: 'Giá phải là một số dương',
  SIZES_REQUIRED: 'Kích thước không để trống',
  CREATE_PRODUCT_SUCCESS: 'Tạo sản phẩm thành công',
  UPDATE_SUCCESS: 'Cập nhật sản phẩm thành công',
  DELETE_SUCCESS: 'Xóa sản phẩm thành công',
  PRODUCT_NOT_FOUND: 'Sản phẩm không tồn tại',
  GET_PRODUCT_SUCCESS: 'Lấy sản phẩm thành công',
  CREATE_SIZE_SUCCESS: 'Tạo kích thước thành công',
  CREATE_COLOR_SUCCESS: 'Tạo màu sắc thành công',
  GET_OPTION_PRODUCT_SUCCESS: 'Lấy tùy chọn sản phẩm thành công',
  CREATE_OPTION_PRODUCT_SUCCESS: 'Tạo tùy chọn sản phẩm thành công',
  UPDATE_OPTION_PRODUCT_SUCCESS: 'Cập nhật tùy chọn sản phẩm thành công',
  DELETE_OPTION_PRODUCT_SUCCESS: 'Xóa tùy chọn sản phẩm thành công',
  EXPORT_FILE_SUCCESS: 'Xuất file thành công',
  OPTION_PRODUCT_EXISTS: 'Tùy chọn sản phẩm đã tồn tại'
}

export const MEDIA_MESSAGES = {
  UPLOAD_SUCCESS: 'Upload file success'
} as const

export const RATINGS_MESSAGES = {
  CREATE_SUCCESS: 'Tạo đánh giá thành công',
  UPDATE_SUCCESS: 'Cập nhật đánh giá thành công',
  DELETE_SUCCESS: 'Xóa đánh giá thành công',
  RATING_NOT_FOUND: 'Đánh giá không tồn tại',
  STAR_REQUIRED: 'Số sao không để trống',
  STAR_MUST_BE_A_NUMBER: 'Số sao phải là một số',
  STAR_MUST_BE_A_POSITIVE_NUMBER: 'Số sao phải là một số dương',
  COMMENT_REQUIRED: 'Bình luận không để trống',
  COMMENT_MUST_BE_A_STRING: 'Bình luận phải là một chuỗi'
} as const

export const CARTS_MESSAGES = {
  ADD_TO_CART_SUCCESS: 'Thêm vào giỏ hàng thành công',
  GET_CARTS_SUCCESS: 'Lấy giỏ hàng thành công',
  UPDATE_CART_SUCCESS: 'Cập nhật giỏ hàng thành công',
  DELETE_CART_SUCCESS: 'Xóa sản phẩm thành công',
  BUY_PRODUCT_SUCCESS: 'Mua sản phẩm thành công'
} as const

export const ORDERS_MESSAGES = {
  ORDER_PENDING: 'Đang chờ xử lý',
  ORDER_SUCCESS: 'Đặt hàng thành công'
}
