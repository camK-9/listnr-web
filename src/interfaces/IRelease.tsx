import IArtist from "./IArtist";
import IReview from "./IReview";

export default interface Release {
  spotifyId: string,
  title: string,
  type: string,
  releaseDate: string,
  totalTracks: string
  trackNumber: number
  durationMs?: number
  imageUrl?: string,
  spotifyUrl?: string,
  albumId?: string,
  album?: Release
  artist: IArtist
  isInQueue?: boolean
  isInHistory?: boolean
  recentReviews?: IReview[]
  stats?: {
    averageRating: number
    totalListeners: number
    totalReviews: number
  }
}