import { Router } from 'express'
import {
  createAddressController,
  deleteAddressController,
  getAddressController,
  updateAddressController
} from '~/controllers/addresses.controllers'
import { accessTokenValidator } from '~/middlewares/commons.middlewares'
import { wrapRequestHandler } from '~/utils/hanlders'
const addressesRouter = Router()

/**
 * Description: Gett address
 * Path: /
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 */
addressesRouter.get('/', accessTokenValidator, wrapRequestHandler(getAddressController))

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
