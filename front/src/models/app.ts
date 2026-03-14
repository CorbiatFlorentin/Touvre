export type View =
  | 'home'
  | 'association'
  | 'evenements'
  | 'inscription-vide-grenier'
  | 'inscription-mechoui'
  | 'admin-login'
  | 'admin'

export type EventType = 'MICHOUI' | 'VIDE_GRENIER'
export type MechouiTarif =
  | 'ADULTE'
  | 'ENFANT_MOINS_12'
  | 'ENFANT_MOINS_3'

export type MechouiParticipantInput = {
  nom: string
  prenom: string
  tarif: MechouiTarif
}

export type Registration = {
  id: number
  formulaireId: number | null
  nom: string
  prenom: string | null
  email: string
  phoneNumber?: string | null
  event: EventType
  tarif: MechouiTarif | null
  accompteVerser: boolean
  accompteMontant: number | null
  createdAt: string
}

export type RegistrationUpdatePayload = {
  nom: string
  prenom: string | null
  email: string
  phoneNumber: string | null
  event: EventType
  tarif: MechouiTarif | null
  accompteVerser: boolean
  accompteMontant: number | null
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'
