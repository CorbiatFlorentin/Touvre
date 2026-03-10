import { useCallback, useEffect, useState } from 'react'
import type {
  Registration,
  RegistrationUpdatePayload,
  View,
} from '../models/app'
import {
  deleteRegistration,
  fetchRegistrationsByEvent,
  parseRegistration,
  parseRegistrations,
  updateRegistration,
} from '../services/api'
import { getInitialView, getPathFromView, getViewFromPath } from './navigation'

export function useAppController() {
  const [view, setView] = useState<View>(() => getInitialView())
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null
    }
    return localStorage.getItem('admin_token')
  })
  const [isAdminAuthed, setIsAdminAuthed] = useState(Boolean(token))
  const [mechouiRegistrations, setMechouiRegistrations] = useState<
    Registration[]
  >([])
  const [videGrenierRegistrations, setVideGrenierRegistrations] = useState<
    Registration[]
  >([])
  const [pendingIds, setPendingIds] = useState<number[]>([])
  const [adminErrorMessage, setAdminErrorMessage] = useState('')

  useEffect(() => {
    const handlePopState = () => {
      setView(getViewFromPath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    if (view === 'admin' && !isAdminAuthed) {
      setView('admin-login')
      window.history.pushState({}, '', getPathFromView('admin-login'))
    }
  }, [view, isAdminAuthed])

  useEffect(() => {
    setIsAdminAuthed(Boolean(token))
  }, [token])

  const fetchRegistrations = useCallback(async (authToken: string) => {
    setAdminErrorMessage('')
    const [mechouiResponse, videGrenierResponse] = await Promise.all([
      fetchRegistrationsByEvent('MICHOUI', authToken),
      fetchRegistrationsByEvent('VIDE_GRENIER', authToken),
    ])

    if (!mechouiResponse.ok || !videGrenierResponse.ok) {
      setAdminErrorMessage("Impossible de charger les inscriptions.")
      return
    }

    const [mechouiData, videGrenierData] = await Promise.all([
      parseRegistrations(mechouiResponse),
      parseRegistrations(videGrenierResponse),
    ])
    setMechouiRegistrations(mechouiData)
    setVideGrenierRegistrations(videGrenierData)
  }, [])

  const withPendingId = useCallback(async (id: number, action: () => Promise<void>) => {
    setPendingIds((current) => [...current, id])
    try {
      await action()
    } finally {
      setPendingIds((current) => current.filter((value) => value !== id))
    }
  }, [])

  const handleSaveRegistration = useCallback(
    async (id: number, payload: RegistrationUpdatePayload) => {
      if (!token) {
        return
      }

      setAdminErrorMessage('')
      await withPendingId(id, async () => {
        const response = await updateRegistration(id, payload, token)

        if (!response.ok) {
          setAdminErrorMessage(
            "Impossible de modifier cette inscription. Verifiez les champs."
          )
          return
        }

        const updated = await parseRegistration(response)
        if (updated.event === 'MICHOUI') {
          setMechouiRegistrations((current) =>
            current.map((entry) => (entry.id === id ? updated : entry))
          )
          return
        }

        setVideGrenierRegistrations((current) =>
          current.map((entry) => (entry.id === id ? updated : entry))
        )
      })
    },
    [token, withPendingId]
  )

  const handleDeleteRegistration = useCallback(
    async (id: number) => {
      if (!token) {
        return
      }
      if (!window.confirm('Confirmer la suppression de cette inscription ?')) {
        return
      }

      setAdminErrorMessage('')
      await withPendingId(id, async () => {
        const response = await deleteRegistration(id, token)

        if (!response.ok) {
          setAdminErrorMessage("Impossible de supprimer cette inscription.")
          return
        }

        setMechouiRegistrations((current) =>
          current.filter((entry) => entry.id !== id)
        )
        setVideGrenierRegistrations((current) =>
          current.filter((entry) => entry.id !== id)
        )
      })
    },
    [token, withPendingId]
  )

  useEffect(() => {
    if (view === 'admin' && token) {
      fetchRegistrations(token)
    }
  }, [fetchRegistrations, token, view])

  const setViewWithRoute = useCallback((nextView: View) => {
    setView(nextView)
    if (nextView === 'admin' || nextView === 'admin-login') {
      window.history.pushState({}, '', getPathFromView(nextView))
      return
    }
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/')
    }
  }, [])

  const handleNavigate = useCallback(
    (target: string) => {
      if (target === 'association') {
        setViewWithRoute('association')
        return
      }
      if (target === 'evenements') {
        setViewWithRoute('evenements')
        return
      }
      if (target === 'inscription-vide-grenier') {
        setViewWithRoute('inscription-vide-grenier')
        return
      }
      if (target === 'inscription-mechoui') {
        setViewWithRoute('inscription-mechoui')
        return
      }
      if (target === 'admin-login') {
        setViewWithRoute('admin-login')
        return
      }
      if (target === 'admin') {
        setViewWithRoute('admin')
        return
      }

      setViewWithRoute('home')
      requestAnimationFrame(() => {
        const section = document.getElementById(target)
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    },
    [setViewWithRoute]
  )

  const handleAdminLoginWithToken = useCallback(
    (authToken: string) => {
      setToken(authToken)
      localStorage.setItem('admin_token', authToken)
      setIsAdminAuthed(true)
      setViewWithRoute('admin')
    },
    [setViewWithRoute]
  )

  const handleAdminLogout = useCallback(() => {
    setIsAdminAuthed(false)
    setToken(null)
    localStorage.removeItem('admin_token')
    setMechouiRegistrations([])
    setVideGrenierRegistrations([])
    setPendingIds([])
    setAdminErrorMessage('')
    setViewWithRoute('admin-login')
  }, [setViewWithRoute])

  return {
    view,
    handleNavigate,
    setViewWithRoute,
    handleAdminLoginWithToken,
    handleAdminLogout,
    mechouiRegistrations,
    videGrenierRegistrations,
    handleSaveRegistration,
    handleDeleteRegistration,
    pendingIds,
    adminErrorMessage,
  }
}
