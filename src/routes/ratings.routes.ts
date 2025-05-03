import { Router } from 'express'
import { creatRatingController } from '~/controllers/ratings.controllers'
import { accessTokenValidator } from '~/middlewares/commons.middlewares'
import { wrapRequestHandler } from '~/utils/hanlders'
const ratingsRouter = Router()

/**
 * Description: create rating
 * Path: /create/:product_id
 * Method: POST
 * Body: {star: number, comment: string}
 * Headers: {Authorization: Bearer <access_token>}
 */
ratingsRouter.post('/create/:product_id', accessTokenValidator, wrapRequestHandler(creatRatingController))

/**
 * Description: Edit rating
 * Path: /edit/:product_id
 * Method: POST
 * Body: {star: number, comment: string}
 * Headers: {Authorization: Bearer <access_token>}
 * Người dùng sửa đánh giá sản phẩm
 */
ratingsRouter.post('/edit/:product_id', accessTokenValidator, wrapRequestHandler(creatRatingController))

/**
 * Description: create a new user
 * Path: /create
 * Method: POST
 * Body: {star: number, comment: string}
 * Headers: {Authorization: Bearer <access_token>}
 * Người dùng sửa đánh giá sản phẩm
 */
ratingsRouter.patch('/edit/:product_id', accessTokenValidator, wrapRequestHandler(creatRatingController))

export default ratingsRouter
