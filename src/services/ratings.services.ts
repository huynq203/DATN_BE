import { RatingReqBody } from '~/models/requests/Ratings.requests'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import Rating from '~/models/schemas/Ratings.schemas'

class RatingsService {
  async getRatings() {}
  async getRatingByProductId(product_id: string) {}
  async createRating({
    customer_id,
    product_id,
    payload
  }: {
    customer_id: string
    product_id: string
    payload: RatingReqBody
  }) {
    const rating = await databaseService.ratings.insertOne(
      new Rating({
        ...payload,
        customer_id: new ObjectId(customer_id),
        product_id: new ObjectId(product_id)
      })
    )
    return rating
  } // EvaluateReqBody
  async updateRating(rating_id: string, payload: any) {} // EvaluateReqBody
  async deleteRating(rating_id: string) {}
}

const ratingsService = new RatingsService()
export default ratingsService
