import IArtist from "./IArtist";
import IUser from "./IUser";

export default interface FollowArtist {
    userId: string,
    artistId: string,
    user: IUser,
    artist: IArtist
}