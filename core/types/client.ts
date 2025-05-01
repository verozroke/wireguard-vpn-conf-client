import type { Subnet } from './subnet'
import type { User } from './user'

export type Client = {
  id: string
  name: string
  clientIp: string
  publicKey: string
  privateKeyRef: string
  isEnabled: boolean
  subnetId: number
  subnet?: Subnet
  userId: string
  user?: User
}
