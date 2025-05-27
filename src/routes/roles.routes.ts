import { Router } from 'express'
import { deleteAddressController } from '~/controllers/addresses.controllers'
import {
  createRoleController,
  getAllRoleController,
  getRolebyIdController,
  updateRoleController
} from '~/controllers/roles.controllers'
import { accessTokenValidator } from '~/middlewares/commons.middlewares'
import { createRoleValidator } from '~/middlewares/roles.middlewares'
import { wrapRequestHandler } from '~/utils/hanlders'
const rolesRouter = Router()

/**
 * Description: get all role
 * Path: /
 * Method: GET
 */
rolesRouter.get('/', accessTokenValidator, wrapRequestHandler(getAllRoleController))

/**
 * Description: Get role by id
 * Path: /create
 * Method: POST
 * Body: {name:string,email:string,password:string,confirmPassword:string,Date of birth: 8601}
 *
 */
rolesRouter.get('/:role_id', accessTokenValidator, createRoleValidator, wrapRequestHandler(getRolebyIdController))

/**
 * Description: Get role by id
 * Path: /create
 * Method: POST
 * Body: {name:string,email:string,password:string,confirmPassword:string,Date of birth: 8601}
 *
 */
rolesRouter.post('/create', accessTokenValidator, createRoleValidator, wrapRequestHandler(createRoleController))

/**
 * Description: create a new role
 * Path: /update
 * Method: PUT
 * Body: {name:string,email:string,password:string,confirmPassword:string,Date of birth: 8601}
 *
 */
rolesRouter.put('/update', accessTokenValidator, createRoleValidator, wrapRequestHandler(updateRoleController))

/**
 * Description: delete role
 * Path: /delete
 * Method: DELETE
 * Body: {role_id:string}
 *
 */
rolesRouter.delete('/delete', accessTokenValidator, createRoleValidator, wrapRequestHandler(deleteAddressController))

export default rolesRouter
