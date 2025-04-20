import { Router } from 'express'
const usersRouter = Router()
import {
  createUserController,
  getMeUserController,
  loginUserController,
  logoutUserController
} from '~/controllers/users.controllers'
import { accessTokenValidator, refreshTokenValidator } from '~/middlewares/commons.middlewares'
import { createUserValidator, loginUserValidator } from '~/middlewares/users.middlewares'
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
 * Description: create a new user
 * Path: /create
 * Method: POST
 * Body: {name:string,email:string,password:string,confirmPassword:string,Date of birth: 8601}
 */

/**
 * Description: Get my profile
 * Path: /me
 * Method: GET
 * Header: {Authorization: Bearer <access_token>}
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeUserController))

usersRouter.post('/create', accessTokenValidator, createUserValidator, wrapRequestHandler(createUserController))

export default usersRouter
