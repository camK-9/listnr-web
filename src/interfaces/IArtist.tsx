import IFollowArtist from "./IFollowArtist";
import IRelease from "./IRelease";

export default interface Artist {
    id: string,
    name: string,
    genres: string[],
    imageUrl?: string,
    releases: IRelease[],
    followers: IFollowArtist[]
}