export const endpoints = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  USERS: {
    PROFILE: '/users/me',
    USER_PROFILE: (id: string) => `/users/profile/${id}`,
    FOLLOW: (id: string) => `/users/follow/${id}`,
    SEARCH: (query: string) => `/users/search?q=${query}`,
    POPULAR: '/users/popular',
  },
  ARTISTS: {
    SEARCH: (query: string) => `/artists/search?q=${query}`,
    PROFILE: (id: string) => `/artists/profile/${id}`,
    EXISTS: (id: string) => `/artists/${id}`,
    FOLLOW: (id: string) => `/artists/follow/${id}`,
    POPULAR: '/artists/popular',
  },
  RELEASES: {
    SEARCH: (query: string) => `/releases/search?q=${query}`,
    EXISTS: (id: string) => `/releases/${id}`,
    TRACKS: (id: string) => `/releases/${id}/tracks`,
    STATS: (id: string) => `/releases/stats/${id}`,
    NEWS: '/releases/new'
  },
  REVIEWS: {
    EXISTS: (id: string) => `/reviews/${id}`,
    CREATE: (id: string) => `/reviews/${id}`,
    LIKE: (id: string) => `/reviews/${id}/like`,
    COMMENT: (id: string) => `/reviews/${id}/comments`,
    LIKE_COMMENT: (id: string) => `/reviews/comments/${id}/like`,
    REPLY_COMMENT: (id: string, idComment: string) => `/reviews/${id}/comments/${idComment}/reply`,
    POPULAR: '/reviews/popular',
  },
  LIBRARY: {
    QUEUE: '/library/queue',
    HISTORY: '/library/history',
    TOGGLE_QUEUE: (id: string) => `/library/queue/${id}`,
    TOGGLE_HISTORY: (id: string) => `/library/history/${id}`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
  },
  FEED: '/feed',
} as const;