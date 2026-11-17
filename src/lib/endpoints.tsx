export const endpoints = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  USERS: {
    POPULAR: '/users/popular',
    PROFILE: '/users/me',
    USER_PROFILE: (id: string) => `/users/profile/${id}`,
    FOLLOW: (id: string) => `/users/follow/${id}`,
    SEARCH: (query: string) => `/users/search?q=${query}`,
    ADD_FAV: '/users/favorites',
    DELETE_FAV: '/users/favorites',
    REORDER_FAV: '/users/favorites/reorder',
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
    ARTIST: (id: string) => `/releases/artist/${id}`,
    NEWS: '/releases/new'
  },
  REVIEWS: {
    EXISTS: (id: string) => `/reviews/${id}`,
    CREATE: (id: string) => `/reviews/${id}`,
    RELEASE: (id: string) => `/reviews/release/${id}`,
    LIKE: (id: string) => `/reviews/${id}/like`,
    COMMENT: (id: string) => `/reviews/${id}/comment`,
    COMMENTS: (id: string) => `/reviews/${id}/comments`,
    LIKE_COMMENT: (id: string) => `/reviews/comments/${id}/like`,
    REPLY_COMMENT: (id: string, idComment: string) => `/reviews/${id}/comments/${idComment}/reply`,
    REPLY_COMMENTS: (idComment: string) => `/reviews/comments/${idComment}/replies`,
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