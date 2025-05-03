import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ROLES_MESSAGES } from '~/constants/messages'
import { RoleReqBody } from '~/models/requests/Role.requests'
import roleService from '~/services/roles.services'
import dotenv from 'dotenv'
dotenv.config()

export const getAllRoleController = async (req: Request, res: Response, next: NextFunction) => {}
export const getRolebyIdController = async (req: Request, res: Response, next: NextFunction) => {}

export const createRoleController = async (
  req: Request<ParamsDictionary, any, RoleReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await roleService.createRole(req.body)
  res.json({
    message: ROLES_MESSAGES.CREATE_SUCCESS,
    result
  })
  return
}

export const updateRoleController = async (
  req: Request<ParamsDictionary, any, RoleReqBody>,
  res: Response,
  next: NextFunction
) => {
  res.json({
    message: ROLES_MESSAGES.UPDATE_SUCCESS
  })
  return
}

export const deleteRoleController = async (
  req: Request<ParamsDictionary, any, RoleReqBody>,
  res: Response,
  next: NextFunction
) => {
  res.json({
    message: ROLES_MESSAGES.DELETE_SUCCESS
  })
  return
}
