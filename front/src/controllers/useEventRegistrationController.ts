import { useCallback, useState, type FormEvent } from 'react'
import type { AsyncStatus, EventType } from '../models/app'
import { createRegistration } from '../services/api'

export function useEventRegistrationController(eventType: EventType) {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [accompte, setAccompte] = useState(false)
  const [montant, setMontant] = useState('')
  const [status, setStatus] = useState<AsyncStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setStatus('loading')
      setErrorMessage('')

      try {
        const response = await createRegistration({
          nom,
          email,
          phoneNumber: phone || null,
          event: eventType,
          accompteVerser: accompte,
          accompteMontant: accompte ? montant : null,
        })

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
      } catch {
        setStatus('error')
        setErrorMessage("Erreur reseau. Verifiez que l'API est demarree.")
      }
    },
    [accompte, email, eventType, montant, nom, phone]
  )

  return {
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
    status,
    errorMessage,
    handleSubmit,
  }
}
