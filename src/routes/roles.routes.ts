import { Router } from 'express'
import { deleteAddressController } from '~/controllers/addresses.controllers'
import { createRoleController, updateRoleController } from '~/controllers/roles.controllers'
import { accessTokenValidator } from '~/middlewares/commons.middlewares'
import { createRoleValidator } from '~/middlewares/roles.middlewares'
import { wrapRequestHandler } from '~/utils/hanlders'
const rolesRouter = Router()

/**
 * Description: create a new role
 * Path: /create
 * Method: POST
 * Body: {name:string,email:string,password:string,confirmPassword:string,Date of birth: 8601}
 *
 */
rolesRouter.post('/create', accessTokenValidator, createRoleValidator, wrapRequestHandler(createRoleController))

/**
 * Description: create a new role
 * Path: /edit/:_id
 * Method: PUT
 * Body: {name:string,email:string,password:string,confirmPassword:string,Date of birth: 8601}
 *
 */
rolesRouter.put('/edit/:_id', accessTokenValidator, createRoleValidator, wrapRequestHandler(updateRoleController))

/**
 * Description: create a new role
 * Path: /edit/:_id
 * Method: PUT
 * Body: {name:string,email:string,password:string,confirmPassword:string,Date of birth: 8601}
 *
 */
rolesRouter.delete(
  '/delete/:_id',
  accessTokenValidator,
  createRoleValidator,
  wrapRequestHandler(deleteAddressController)
)

export default rolesRouter
