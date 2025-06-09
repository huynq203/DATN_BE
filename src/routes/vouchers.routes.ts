import { Router } from 'express'
import {
  createVoucherController,
  deleteVoucherController,
  getAllVoucherController,
  saveVoucherController,
  updateVoucherController
} from '~/controllers/vouchers.controllers'
import { accessTokenValidator } from '~/middlewares/commons.middlewares'
import { CheckVoucherValidator, VoucherValidator } from '~/middlewares/vouchers.middlewares'
import { wrapRequestHandler } from '~/utils/hanlders'
const vouchersRouter = Router()

/**
 * Description: Create a new vourcher
 * Path: /create
 * Method: POST
 * Body: {name:string,code:string,discount:number,quantity:number,start_date:strting,end_date:string}
 * Header: {Authorization: Bearer <access_token>}
 */
vouchersRouter.get('/', accessTokenValidator, wrapRequestHandler(getAllVoucherController))

/**
 * Description: Create a new vourcher
 * Path: /create
 * Method: POST
 * Body: {name:string,code:string,discount:number,quantity:number,start_date:strting,end_date:string}
 * Header: {Authorization: Bearer <access_token>}
 */
vouchersRouter.post('/create', accessTokenValidator, VoucherValidator, wrapRequestHandler(createVoucherController))

/**
 * Description: Update a  vourcher
 * Path: /create
 * Method: POST
 * Body: {name:string,code:string,discount:number,quantity:number,start_date:strting,end_date:string}
 * Header: {Authorization: Bearer <access_token>}
 */
vouchersRouter.put('/update', accessTokenValidator, wrapRequestHandler(updateVoucherController))

/**
 * Description: Update a  vourcher
 * Path: /create
 * Method: POST
 * Body: {name:string,code:string,discount:number,quantity:number,start_date:strting,end_date:string}
 * Header: {Authorization: Bearer <access_token>}
 */
vouchersRouter.delete('/delete', accessTokenValidator, wrapRequestHandler(deleteVoucherController))

/**
 * Description: Check a  vourcher
 * Path: /check-voucher
 * Method: POST
 * Body: {name:string,code:string,discount:number,quantity:number,start_date:strting,end_date:string}
 * Header: {Authorization: Bearer <access_token>}
 */
vouchersRouter.post(
  '/save-voucher',
  accessTokenValidator,
  CheckVoucherValidator,
  wrapRequestHandler(saveVoucherController)
)

export default vouchersRouter
