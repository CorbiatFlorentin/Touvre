import { useCallback, useState, type FormEvent } from 'react'
import type {
  AsyncStatus,
  EventType,
  MechouiParticipantInput,
} from '../models/app'
import { createRegistration } from '../services/api'

const createEmptyParticipant = (): MechouiParticipantInput => ({
  nom: '',
  prenom: '',
  tarif: 'ADULTE',
})

export function useEventRegistrationController(eventType: EventType) {
  const isMechoui = eventType === 'MICHOUI'
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [accompte, setAccompte] = useState(false)
  const [montant, setMontant] = useState('')
  const [participants, setParticipants] = useState<MechouiParticipantInput[]>([
    createEmptyParticipant(),
  ])
  const [status, setStatus] = useState<AsyncStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const updateParticipant = useCallback(
    <K extends keyof MechouiParticipantInput>(
      index: number,
      field: K,
      value: MechouiParticipantInput[K]
    ) => {
      setParticipants((current) =>
        current.map((participant, participantIndex) =>
          participantIndex === index
            ? { ...participant, [field]: value }
            : participant
        )
      )
    },
    []
  )

  const addParticipant = useCallback(() => {
    setParticipants((current) => [...current, createEmptyParticipant()])
  }, [])

  const removeParticipant = useCallback((index: number) => {
    setParticipants((current) =>
      current.length === 1
        ? current
        : current.filter((_, participantIndex) => participantIndex !== index)
    )
  }, [])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setStatus('loading')
      setErrorMessage('')

      try {
        const response = await createRegistration(
          isMechoui
            ? {
                email,
                phoneNumber: phone || null,
                event: eventType,
                accompteVerser: accompte,
                accompteMontant: accompte ? montant : null,
                participants: participants.map((participant) => ({
                  nom: participant.nom.trim(),
                  prenom: participant.prenom.trim(),
                  tarif: participant.tarif,
                })),
              }
            : {
                nom,
                email,
                phoneNumber: phone || null,
                event: eventType,
                accompteVerser: accompte,
                accompteMontant: accompte ? montant : null,
              }
        )

        if (!response.ok) {
          setStatus('error')
          setErrorMessage(
            "Impossible d'envoyer l'inscription. Verifiez les champs."
          )
          return
        }

        setStatus('success')
        setNom('')
        setEmail('')
        setPhone('')
        setAccompte(false)
        setMontant('')
        setParticipants([createEmptyParticipant()])
      } catch {
        setStatus('error')
        setErrorMessage("Erreur reseau. Verifiez que l'API est demarree.")
      }
    },
    [accompte, email, eventType, isMechoui, montant, nom, participants, phone]
  )

  return {
    isMechoui,
    nom,
    setNom,
    email,
    setEmail,
    phone,
    setPhone,
    accompte,
    setAccompte,
    montant,
    setMontant,
    participants,
    updateParticipant,
    addParticipant,
    removeParticipant,
    status,
    errorMessage,
    handleSubmit,
  }
}
