import axios from "axios"
import type { Subnet } from "../types/subnet"

const config = useRuntimeConfig()

const ROUTE_SEGMENT = 'subnet'
const BASE_URL = config.public.API_URL ? `${config.public.API_URL}/${ROUTE_SEGMENT}` : ''

export type SubnetCreateBody = {
  name: string
  subnetIp: string
  subnetMask: number
  userId: string
}


export type SubnetEditBody = {
  name: string
  subnetIp: string
  subnetMask: number
}

class SubnetService {
  private BASE_URL: string

  constructor(BASE_URL: string) { this.BASE_URL = BASE_URL }

  private getAuthHeaders() {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  }


  async subnets(): Promise<Subnet[]> {
    const { data } = await axios.get<Subnet[]>(`${this.BASE_URL}/`, {
      headers: this.getAuthHeaders()
    })

    return data
  }


  async delete(subnetId: string): Promise<string> {
    await axios.delete(`${this.BASE_URL}/${subnetId}`, {
      headers: this.getAuthHeaders()
    })

    return 'Subnet was deleted successfully'
  }


  async create(body: SubnetCreateBody): Promise<Subnet> {
    const { data } = await axios.post<Subnet>(`${this.BASE_URL}/`, body, {
      headers: this.getAuthHeaders()
    })

    return data
  }


  async edit(subnetId: string, body: SubnetEditBody): Promise<Subnet> {
    await axios.put<Subnet>(`${this.BASE_URL}/${subnetId}/name`, {
      name: body.name
    }, {
      headers: this.getAuthHeaders()
    })
    await axios.put<Subnet>(`${this.BASE_URL}/${subnetId}/subnet-ip`, {
      subnetIp: body.subnetIp

    }, {
      headers: this.getAuthHeaders()
    })
    const { data } = await axios.put<Subnet>(`${this.BASE_URL}/${subnetId}/subnet-mask`, {
      subnetMask: body.subnetMask
    }, {
      headers: this.getAuthHeaders()
    })

    return data

  }


}

function createSubnetService(API_URL: string): SubnetService {
  return new SubnetService(API_URL)
}


export const subnetService = createSubnetService(BASE_URL)