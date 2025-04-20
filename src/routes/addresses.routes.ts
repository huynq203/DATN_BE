import { Router } from 'express'
import {
  createAddressController,
  deleteAddressController,
  updateAddressController
} from '~/controllers/addresses.controllers'
import { accessTokenValidator } from '~/middlewares/commons.middlewares'
import { wrapRequestHandler } from '~/utils/hanlders'
const addressesRouter = Router()

/**
 * Description: Create a new address
 * Path: /create
 * Method: POST
 * Body: {name:string,description:string}
 * Headers: {Authorization: Bearer <access_token>}
 */
addressesRouter.post('/create', accessTokenValidator, wrapRequestHandler(createAddressController))

/**
 * Description: Update a address
 * Path: /edit/:id
 * Method: PUT
 * Body: {name:string,description:string}
 * Headers: {Authorization: Bearer <access_token>}
 */
addressesRouter.put('/edit/:id', accessTokenValidator, wrapRequestHandler(updateAddressController))

/**
 * Description: Delete a address
 * Path: /edit/:id
 * Method: PUT
 * Body: {name:string,description:string}
 * Headers: {Authorization: Bearer <access_token>}
 */
addressesRouter.delete('/delete/:id', accessTokenValidator, wrapRequestHandler(deleteAddressController))

export default addressesRouter
