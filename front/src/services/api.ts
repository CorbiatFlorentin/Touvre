import type {
  EventType,
  MechouiParticipantInput,
  Registration,
  RegistrationUpdatePayload,
} from '../models/app'

const API_BASE =
  import.meta.env.VITE_API_URL?.toString() || 'http://localhost:3001'

export async function createRegistration(payload: {
  nom?: string
  email: string
  phoneNumber: string | null
  event: EventType
  accompteVerser: boolean
  accompteMontant: string | null
  participants?: MechouiParticipantInput[]
}) {
  return fetch(`${API_BASE}/api/inscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function loginAdmin(payload: {
  email: string
  password: string
}) {
  return fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function fetchRegistrationsByEvent(
  event: EventType,
  authToken: string
): Promise<Response> {
  return fetch(`${API_BASE}/api/inscriptions?event=${event}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  })
}

export async function updateRegistration(
  id: number,
  payload: RegistrationUpdatePayload,
  authToken: string
): Promise<Response> {
  return fetch(`${API_BASE}/api/inscriptions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  })
}

export async function deleteRegistration(
  id: number,
  authToken: string
): Promise<Response> {
  return fetch(`${API_BASE}/api/inscriptions/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
}

export async function parseRegistration(response: Response): Promise<Registration> {
  return response.json()
}

export async function parseRegistrations(
  response: Response
): Promise<Registration[]> {
  return response.json()
}
