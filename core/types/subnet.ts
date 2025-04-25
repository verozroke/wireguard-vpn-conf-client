import type { Client } from "./client"



export type Subnet = {
  id: string
  name: string
  subnetIp: string
  subnetMask: number // (0-32)
  clients?: Client[]
}


