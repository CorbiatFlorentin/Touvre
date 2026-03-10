export type View =
  | 'home'
  | 'association'
  | 'evenements'
  | 'inscription-vide-grenier'
  | 'inscription-mechoui'
  | 'admin-login'
  | 'admin'

export type EventType = 'MICHOUI' | 'VIDE_GRENIER'

export type Registration = {
  id: number
  nom: string
  email: string
  phoneNumber?: string | null
  event: EventType
  accompteVerser: boolean
  accompteMontant: number | null
  createdAt: string
}

export type RegistrationUpdatePayload = {
  nom: string
  email: string
  phoneNumber: string | null
  event: EventType
  accompteVerser: boolean
  accompteMontant: number | null
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'
