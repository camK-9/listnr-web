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
  },
  ARTISTS: {
    SEARCH: (query: string) => `/artists/search?q=${query}`,
    EXISTS: (id: string) => `/artists/${id}`,
    FOLLOW: (id: string) => `/artists/follow/${id}`,
  },
  RELEASES: {
    SEARCH: (query: string) => `/releases/search?q=${query}`,
    EXISTS: (id: string) => `/releases/${id}`,
    STATS: (id: string) => `/releases/stats/${id}`,
    NEWS: '/releases/new'
  },
  REVIEWS: {
    EXISTS: (id: string) => `/reviews/${id}`,
    CREATE: (id: string) => `/reviews/${id}`,
    LIKE: (id: string) => `/reviews/${id}/like`,
    COMMENTS: (id: string) => `/reviews/${id}/comments`,
    POPULAR: '/reviews/popular',
    REPLY_COMMENTS: (id: string, idComment: string) => `/reviews/${id}/comments/${idComment}/reply`,
    LIKE_COMMENTS: (id: string) => `/reviews/comments/${id}`,
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