import type { Role } from "../enums/Role"
import type { Subnet } from "./subnet"
import type { Client } from "./client"

export type User = {
  id: string
  login: string
  role: Role
  subnets?: Subnet[]
  clients?: Client[]
}

