import { ObjectId } from 'mongodb'
import { CreateRoleReqBody } from '~/models/requests/Role.requests'
import Role from '~/models/schemas/Roles.schemas'
import databaseService from './database.services'

class RolesService {
  //Tạo role
  async createRole(payload: CreateRoleReqBody) {
    const role_id = new ObjectId()
    const role = await databaseService.roles.insertOne(
      new Role({
        ...payload,
        _id: role_id
      })
    )
    const result = await databaseService.roles.findOne({ _id: role.insertedId })
    return result
  }
}
const roleService = new RolesService()
export default roleService
