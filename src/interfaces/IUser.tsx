import IComment from "./IComment";
import ICommentLike from "./ICommentLike";
import IFollowArtist from "./IFollowArtist";
import IFollowUser from "./IFollowUser";
import ILike from "./ILike";
import ILibrary from "./ILibrary";
import INotification from "./INotification";
import IReview from "./IReview";
import IRelease from "./IRelease";
import IArtist from "./IArtist";

export default interface User {
    id: string,
    username: string,
    email: string,
    password: string,
    avatarUrl?: string,
    bio: string,
    reviews: IReview[],
    followedArtists: IFollowArtist[],
    followers: IFollowUser[],
    following: IFollowUser[],
    queue: ILibrary[],
    history: ILibrary[],
    likes: ILike[],
    comments: IComment[],
    commentLikes: ICommentLike[],
    recentReviews: IReview[],
    favoriteTracks?: IRelease[],
    favoriteAlbums?: IRelease[],
    favoriteArtists?: IArtist[],
    notifications: INotification[],
    actionsPerformed: INotification[],
    stats?: {
        releasesListenedCount: number,
        reviewsCount: number,
        followersCount: number,
        followingCount: number,
        artistsFollowedCount: number,
        artistsListenedCount: number,
        albumsListenedCount: number,
        streakCount: number,
    }
}