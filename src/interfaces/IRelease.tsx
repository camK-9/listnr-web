import IArtist from "./IArtist";

export default interface Release {
  spotifyId: string,
  title: string,
  type: string,
  releaseDate: string,
  totalTracks: string
  imageUrl?: string,
  spotifyUrl?: string,
  albumId?: string,
  album?: Release
  artist: IArtist
  isInQueue?: boolean
  isInHistory?: boolean
}