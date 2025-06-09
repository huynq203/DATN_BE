import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { IsUsed, StatusType } from '~/constants/enums'
import { VOUCHERS_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/Customer.requests'
import SaveVoucher from '~/models/schemas/SaveVouchers.schemas'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const VoucherValidator = validate(
  checkSchema(
    {
      code: {
        custom: {
          options: async (value) => {
            const voucher = await databaseService.vouchers.findOne({
              code: value
            })
            if (voucher) {
              throw new Error(VOUCHERS_MESSAGES.VOUCHER_IS_EXISTS)
            }
          }
        }
      }
    },
    ['body']
  )
)

export const CheckVoucherValidator = validate(
  checkSchema({
    code: {
      custom: {
        options: async (value, { req }) => {
          const { customer_id } = req.decoded_authorization as TokenPayload
          const voucher = await databaseService.vouchers.findOne({
            code: value,
            status: StatusType.Active
          })
          if (
            !voucher ||
            voucher.status === StatusType.Inactive ||
            voucher.quantity <= 0 ||
            voucher.time_end < new Date()
          ) {
            throw new Error(VOUCHERS_MESSAGES.VOUCHER_IS_NOT_EXISTS)
          } else {
            const saveVoucher = await databaseService.saveVoucher.findOne({
              customer_id: new ObjectId(customer_id),
              voucher_id: new ObjectId(voucher?._id)
            })
            if (saveVoucher?.is_used === IsUsed.True) {
              throw new Error(VOUCHERS_MESSAGES.VOUCHER_IS_USED)
            }
          }
          return true
        }
      }
    }
  })
)
