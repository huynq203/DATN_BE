import { Router } from 'express'
import {
  createAddressController,
  deleteAddressController,
  getAddressByCustomer,
  getAllAddressController,
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
addressesRouter.get('/address-by-customer', accessTokenValidator, wrapRequestHandler(getAddressByCustomer))

/**
 * Description: Get address by ID
 * Path: /addresses/:address_id
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 */
addressesRouter.get('/:customer_id', accessTokenValidator, wrapRequestHandler(getAddressByCustomer))

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
 * Path: /edit/:id
 * Method: PUT
 * Body: {name:string,description:string}
 * Headers: {Authorization: Bearer <access_token>}
 */
addressesRouter.delete('/delete', accessTokenValidator, wrapRequestHandler(deleteAddressController))

export default addressesRouter
