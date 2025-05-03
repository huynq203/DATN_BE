import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RATINGS_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/Customer.requests'
import { RatingReqBody } from '~/models/requests/Ratings.requests'
import ratingsService from '~/services/ratings.services'

export const creatRatingController = async (
  req: Request<ParamsDictionary, any, RatingReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.decoded_authorization as TokenPayload
  const { product_id } = req.params
  const result = await ratingsService.createRating({ customer_id, product_id, payload: req.body })
  res.json({
    message: RATINGS_MESSAGES.CREATE_SUCCESS,
    data: result
  })
}
