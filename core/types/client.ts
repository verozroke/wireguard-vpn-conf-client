import type { Subnet } from "./subnet"

export type Client = {
  id: string
  name: string
  clientIp: string
  publicKey: string
  privateKeyRef: string
  isEnabled: boolean
  subnetId: number
  subnet?: Subnet
}
