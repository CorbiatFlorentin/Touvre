import type { View } from '../models/app'

export function getViewFromPath(path: string): View {
  if (path === '/admin') {
    return 'admin'
  }
  if (path === '/admin/connexion') {
    return 'admin-login'
  }
  return 'home'
}

export function getPathFromView(view: View) {
  if (view === 'admin') {
    return '/admin'
  }
  if (view === 'admin-login') {
    return '/admin/connexion'
  }
  return '/'
}

export function getInitialView(): View {
  if (typeof window === 'undefined') {
    return 'home'
  }
  return getViewFromPath(window.location.pathname)
}
