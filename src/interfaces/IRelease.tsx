import IArtist from "./IArtist";
import IListenHistory from "./IListenHistory";
import IListenQueue from "./IListenQueue";
import IReview from "./IReview";

export default interface Release {
  spotifyId: string,
  title: string,
  type: string,
  releaseDate: string,
  imageUrl?: string,
  spotifyUrl: string,
  artistName: string,
}