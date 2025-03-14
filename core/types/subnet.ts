export type Subnet = {
  id: string
  name: string
  subnetIp: string
  subnetMask: number // (0-32)
  clients?: Client[]
}


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
