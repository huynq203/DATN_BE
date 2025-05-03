import { ObjectId } from 'mongodb'
import { RoleReqBody } from '~/models/requests/Role.requests'
import Role from '~/models/schemas/Roles.schemas'
import databaseService from './database.services'

class RolesService {
  //Tạo role
  async createRole(payload: RoleReqBody) {
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
  async updateRole() {}
  async deleteRole(role_id: string) {}
  async getAllRole() {}
  async getRoleById(role_id: string) {}
}
const roleService = new RolesService()
export default roleService
