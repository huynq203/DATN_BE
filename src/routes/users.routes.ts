import { Router } from 'express'
const usersRouter = Router()
import {
  changePasswordUserController,
  changeStatusUserController,
  createUserController,
  deleteUserController,
  exportFileUserController,
  getAllUsersController,
  getMeUserController,
  getUserByIdController,
  loginUserController,
  logoutUserController,
  updateUserController
} from '~/controllers/users.controllers'
import { accessTokenValidator, refreshTokenValidator } from '~/middlewares/commons.middlewares'
import { changePasswordValidatorUser, createUserValidator, loginUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/hanlders'

/**
 * Description: create a new user
 * Path: /create
 * Method: POST
 * Body: {name:string,email:string,password:string,confirmPassword:string,Date of birth: 8601}
 */
usersRouter.post('/login', loginUserValidator, wrapRequestHandler(loginUserController))

/**
 * Description: Logout a user
 * Path: /logout
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {refresh_token:string}
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutUserController))

/**
 * Description: Get my profile
 * Path: /me
 * Method: GET
 * Header: {Authorization: Bearer <access_token>}
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeUserController))

/**
 * Description: Change Password
 * Path: /change-password
 * Method: PUT
 * Body: {ole_password:string,new_password:string,confirm_new_password:string}
 * Header: {Authorization: Bearer <access_token>}
 */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  changePasswordValidatorUser,
  wrapRequestHandler(changePasswordUserController)
)

/**
 * Description: Delete a user
 * Path: /delete
 * Method: DELETE
 * Body: {user_id:string}
 * Header: {Authorization: Bearer <access_token>}
 */
usersRouter.post('/export-file', accessTokenValidator, wrapRequestHandler(exportFileUserController))

/**
 * Description: Get all users
 * Path: /
 * Method: GET
 * Header: {Authorization: Bearer <access_token>}
 */
usersRouter.get('/', accessTokenValidator, wrapRequestHandler(getAllUsersController))

/**
 * Description: Get user by id
 * Path: /user_id
 * Method: GET
 * Header: {Authorization: Bearer <access_token>}
 */
usersRouter.get('/:user_id_change', accessTokenValidator, wrapRequestHandler(getUserByIdController))

/**
 * Description: Change Status User
 * Path: /change-status
 * Method: PATCH
 * Body: {user_id:string,status:StatusType}
 * Header: {Authorization: Bearer <access_token>}
 */
usersRouter.patch('/change-status', accessTokenValidator, wrapRequestHandler(changeStatusUserController))

/**
 * Description: Create a new user
 * Path: /create
 * Method: POST
 * Body: {name:string,email:string,password:string,confirmPassword:string,dateOfBirth:8601,role:string}
 * Header: {Authorization: Bearer <access_token>}
 */
usersRouter.post('/create', accessTokenValidator, createUserValidator, wrapRequestHandler(createUserController))

/**
 * Description: Create a new user
 * Path: /update
 * Method: PUT
 * Body: {name:string,email:string,password:string,confirmPassword:string,dateOfBirth:8601,role:string}
 * Header: {Authorization: Bearer <access_token>}
 */
usersRouter.put('/update', accessTokenValidator, wrapRequestHandler(updateUserController))

/**
 * Description: Delete a user
 * Path: /delete
 * Method: DELETE
 * Body: {user_id:string}
 * Header: {Authorization: Bearer <access_token>}
 */
usersRouter.delete('/delete', accessTokenValidator, wrapRequestHandler(deleteUserController))

export default usersRouter
