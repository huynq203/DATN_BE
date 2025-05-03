import { Router } from 'express'
const customersRouter = Router()
import {
  changePasswordController,
  deleteCustomerController,
  forgotPasswordController,
  getAllCustomersController,
  getMeController,
  loginController,
  logoutController,
  oauthController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  updatetMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/customers.controllers'
import {
  changePasswordValidator,
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  verifiedCustomerValidator,
  verifyEmailTokenValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/customers.middlewares'
import { accessTokenValidator, isLoggedInVaidator, refreshTokenValidator } from '~/middlewares/commons.middlewares'
import { wrapRequestHandler } from '~/utils/hanlders'

/**
 * Description: Register a new user
 * Path: api/customers/register
 * Method: POST
 * Body: {name:string,email:string,password:string,confirmPassword:string,Date of birth: 8601}
 */
customersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: Login a user
 * Path: /login
 * Method: POST
 * Body: {name:string,email:string,password:string}
 */
customersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Oauth with google
 * Path: /oauth/google
 * Method: GET
 */

customersRouter.get('/oauth/google', wrapRequestHandler(oauthController))

/**
 * Description: Logout a user
 * Path: /logout
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {refresh_token:string}
 * Headers: {Authorization: Bearer <access_token>}
 */
customersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Get my profile
 * Path: /me
 * Method: GET
 * Header: {Authorization: Bearer <access_token>}
 * Headers: {Authorization: Bearer <access_token>}
 */
customersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: Update my profile
 * Path: /me
 * Method: PATCH
 * Header: {Authorization: Bearer <access_token>}
 * Body: CustomerSchema
 */
customersRouter.patch('/me', accessTokenValidator, verifiedCustomerValidator, wrapRequestHandler(updatetMeController))

/**
 * Description: Verify email when user client click on the link in email
 * Path: /resend-verify-email
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {}
 */
customersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * Description: Verify email when user client click on the link in email
 * Path: /verify-email
 * Method: POST
 * Body: {email_verify_token:string}
 */
customersRouter.post(
  '/verify-email',
  isLoggedInVaidator(accessTokenValidator),
  verifyEmailTokenValidator,
  wrapRequestHandler(verifyEmailController)
)

/**
 * Description: Submit email to reset-password,send email to user
 * Path: /forgot-password
 * Method: POST
 * Body: {email:string}
 */
customersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description: Verify link in email to reset password
 * Path: /verify-forgot-password
 * Method: POST
 * Body: {forgot-password-token:string}
 */
customersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * Description: Reset-Password
 * Path: /reset-password
 * Method: POST
 * Body: {forgot_password_token:string,password:string,confirm_password:string}
 */
customersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * Description: Change Password
 * Path: /change-password
 * Method: PUT
 * Header: {Authorization: Bearer <access_token>}
 * Body: {old_password:string,new_password:string,confirm_password:string}
 **/
customersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedCustomerValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

/**
 * Description: Get all Customer
 * Path: api/customers/
 * Method: GET
 */
customersRouter.get('/', wrapRequestHandler(getAllCustomersController))

/**
 * Description: Get Customer by Id
 * Path: api/customers/:customer_id
 * Method: GET
 */
customersRouter.get('/:customer_id', wrapRequestHandler(getAllCustomersController))

/**
 * Description: Get Customer by Id
 * Path: api/customers/:customer_id
 * Method: PUT
 */
customersRouter.delete('/delete/:customer_id', wrapRequestHandler(deleteCustomerController))

export default customersRouter
