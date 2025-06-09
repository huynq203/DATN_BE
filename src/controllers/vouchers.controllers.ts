import { NextFunction, Request, Response } from 'express'
import { CreateVoucherReqBody, SaveVoucherReqBody, UpdateVoucherReqBody } from '~/models/requests/Voucher.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/Customer.requests'
import { VOUCHERS_MESSAGES } from '~/constants/messages'
import vouchersService from '~/services/vouchers.services'
import cron from 'node-cron'

export const autoUpdateVoucher = () => {
  cron.schedule('* * * * *', async () => {
    await vouchersService.updateVoucherStatus()
  })
}

export const getAllVoucherController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await vouchersService.getAllVouchers()
  res.json({
    message: VOUCHERS_MESSAGES.GET_VOUCHERS_SUCCESS,
    result
  })
}

export const createVoucherController = async (
  req: Request<ParamsDictionary, any, CreateVoucherReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await vouchersService.createVoucher({ user_id, payload: req.body })
  res.json({
    message: VOUCHERS_MESSAGES.CREATE_SUCCESS,
    result
  })
}

export const updateVoucherController = async (
  req: Request<ParamsDictionary, any, UpdateVoucherReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const reuslt = await vouchersService.updateVoucher({
    user_id,
    payload: req.body
  })
  res.json({
    message: VOUCHERS_MESSAGES.UPDATE_SUCCESS,
    reuslt
  })
}

export const deleteVoucherController = async (req: Request, res: Response, next: NextFunction) => {
  const { voucher_id } = req.body
  await vouchersService.deleteVoucher(voucher_id)
  res.json({
    message: VOUCHERS_MESSAGES.DELETE_SUCCESS
  })
}

export const saveVoucherController = async (
  req: Request<ParamsDictionary, any, SaveVoucherReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.decoded_authorization as TokenPayload
  const { code } = req.body
  const result = await vouchersService.saveVoucher({ customer_id, code })

  res.json({
    message: VOUCHERS_MESSAGES.SAVE_VOUCHER_SUCCESS,
    result
  })
}
