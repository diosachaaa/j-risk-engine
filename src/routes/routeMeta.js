const routeMeta = {
  '/': {
    titleKey: 'landing',
    requiresAuth: false,
    layout: 'public',
  },

  '/auth/login': {
    titleKey: 'login',
    requiresAuth: false,
    layout: 'auth',
  },

  '/auth/register': {
    titleKey: 'register',
    requiresAuth: false,
    layout: 'auth',
  },

  '/auth/verify-email': {
    titleKey: 'verifyEmail',
    requiresAuth: false,
    layout: 'auth',
  },

  '/auth/verify-code': {
    titleKey: 'verifyCode',
    requiresAuth: false,
    layout: 'auth',
  },

  '/dashboard/ciso': {
    titleKey: 'ciso',
    requiresAuth: true,
    layout: 'dashboard',
  },

  '/dashboard/management': {
    titleKey: 'management',
    requiresAuth: true,
    layout: 'dashboard',
  },

  '/dashboard/ciso/assets/:id': {
    titleKey: 'assetDetail',
    requiresAuth: true,
    layout: 'dashboard',
  },
}

export function getRouteMeta(pathname) {
  if (routeMeta[pathname]) return routeMeta[pathname]

  if (/^\/dashboard\/ciso\/assets\/[^/]+$/.test(pathname)) {
    return routeMeta['/dashboard/ciso/assets/:id']
  }

  return null
}

export default routeMeta