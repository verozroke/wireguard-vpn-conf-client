import type { Role } from "../enums/Role"
import type { Subnet } from "./subnet"

export type User = {
  id: string
  login: string
  clientId?: number
  role: Role
  subnets?: Subnet[]
}

