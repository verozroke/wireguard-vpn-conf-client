import type { Client } from "./client"
import type { User } from "./user"



export type Subnet = {
  id: string
  name: string
  subnetIp: string
  subnetMask: number // (0-32)
  clients?: Client[]
  userId: string
  user?: User
}


