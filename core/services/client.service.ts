import axios from 'axios'
import type { Client } from '../types/client'

const config = useRuntimeConfig()

const ROUTE_SEGMENT = 'client'
const BASE_URL = config.public.API_URL
  ? `${config.public.API_URL}/${ROUTE_SEGMENT}`
  : ''

export type ClientCreateBody = {
  name: string
  clientIp: string
  subnetId: string
  userId: string
}

export type ClientEditBody = {
  name: string
  clientIp: string
}

export type QRCodeResponse = {
  qrcode: string
}

export type ClientEnableDisableBody = {
  clientId: string
}

class ClientService {
  private BASE_URL: string

  constructor(BASE_URL: string) {
    this.BASE_URL = BASE_URL
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  async clients(): Promise<Client[]> {
    const { data } = await axios.get<Client[]>(`${this.BASE_URL}/`, {
      headers: this.getAuthHeaders(),
    })

    return data
  }

  async delete(clientId: string): Promise<string> {
    await axios.delete(`${this.BASE_URL}/${clientId}`, {
      headers: this.getAuthHeaders(),
    })

    return 'Client was deleted successfully'
  }

  async create(body: ClientCreateBody): Promise<Client> {
    const { data } = await axios.post<Client>(`${this.BASE_URL}/`, body, {
      headers: this.getAuthHeaders(),
    })

    return data
  }

  async edit(clientId: string, body: ClientEditBody): Promise<Client> {
    await axios.put<Client>(
      `${this.BASE_URL}/${clientId}/name`,
      {
        name: body.name,
      },
      {
        headers: this.getAuthHeaders(),
      }
    )
    const { data } = await axios.put<Client>(
      `${this.BASE_URL}/${clientId}/address`,
      {
        clientIp: body.clientIp,
      },
      {
        headers: this.getAuthHeaders(),
      }
    )

    return data
  }

  // TODO: check if is working
  async configuration(clientId: string): Promise<string> {
    const response = await axios.get<BlobPart>(
      `${this.BASE_URL}/${clientId}/configuration`,
      {
        headers: this.getAuthHeaders(),
        responseType: 'blob',
      }
    )

    const disposition = response.headers['content-disposition']
    const fileName = disposition
      ? disposition.split('filename=')[1].replace(/"/g, '') // Extract file name
      : 'default_filename.txt'

    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return 'Client configuration downloaded.'
  }

  // TODO: check if is working
  async qrcode(clientId: string): Promise<string> {
    const { data } = await axios.get<QRCodeResponse>(
      `${this.BASE_URL}/${clientId}/qrcode`,
      {
        headers: this.getAuthHeaders(),
      }
    )

    return data.qrcode
  }

  async enable(body: ClientEnableDisableBody): Promise<string> {
    await axios.post(`${this.BASE_URL}/${body.clientId}/enable`, body, {
      headers: this.getAuthHeaders(),
    })

    return 'Client enabled successfully.'
  }
  async disable(body: ClientEnableDisableBody): Promise<string> {
    await axios.post(`${this.BASE_URL}/${body.clientId}/disable`, body, {
      headers: this.getAuthHeaders(),
    })

    return 'Client disabled successfully.'
  }
}

function createClientService(API_URL: string): ClientService {
  return new ClientService(API_URL)
}

export const clientService = createClientService(BASE_URL)
