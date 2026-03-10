import { useCallback, useState, type FormEvent } from 'react'
import { loginAdmin } from '../services/api'

export function useAdminLoginController(onSuccess: (token: string) => void) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setStatus('loading')
      setErrorMessage('')

      try {
        const response = await loginAdmin({ email, password })

        if (!response.ok) {
          setStatus('error')
          setErrorMessage('Identifiants invalides.')
          return
        }

        const data = await response.json()
        if (!data?.token) {
          setStatus('error')
          setErrorMessage('Connexion impossible.')
          return
        }

        setStatus('idle')
        onSuccess(data.token)
      } catch {
        setStatus('error')
        setErrorMessage("Erreur reseau. Verifiez que l'API est demarree.")
      }
    },
    [email, onSuccess, password]
  )

  return {
    email,
    setEmail,
    password,
    setPassword,
    status,
    errorMessage,
    handleSubmit,
  }
}
