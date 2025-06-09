import { Router } from 'express'
import {
  createAddressController,
  deleteAddressController,
  getAddressByCustomerController,
  getAddressCustomerManagerController,
  getAllAddressController,
  setAddressDefaultController,
  updateAddressController
} from '~/controllers/addresses.controllers'
import { accessTokenValidator } from '~/middlewares/commons.middlewares'
import { wrapRequestHandler } from '~/utils/hanlders'
const addressesRouter = Router()

// /**
//  * Description: Get all address
//  * Path: /addresses/
//  * Method: GET
//  * Headers: {Authorization: Bearer <access_token>}
//  */
addressesRouter.get('/', accessTokenValidator, wrapRequestHandler(getAllAddressController))

/**
 * Description: Get address by Customer
 * Path: /addresses/address-by-customer
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 */
addressesRouter.get('/address-by-customer', accessTokenValidator, wrapRequestHandler(getAddressByCustomerController))

/**
 * Description: Get address by Customer Manager
 * Path: /addresses/:address_id
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 */
addressesRouter.get('/:customer_id', accessTokenValidator, wrapRequestHandler(getAddressCustomerManagerController))

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
addressesRouter.put('/update', accessTokenValidator, wrapRequestHandler(updateAddressController))

/**
 * Description: Delete a address
 * Path: /delete
 * Method: PUT
 * Body: {name:string,description:string}
 * Headers: {Authorization: Bearer <access_token>}
 */
addressesRouter.delete('/delete', accessTokenValidator, wrapRequestHandler(deleteAddressController))

/**
 * Description: Set is Default a address
 * Path: /set-default-address
 * Method: PUT
 * Body: {address_id:string}
 * Headers: {Authorization: Bearer <access_token>}
 */
addressesRouter.put('/set-default-address', accessTokenValidator, wrapRequestHandler(setAddressDefaultController))

export default addressesRouter
