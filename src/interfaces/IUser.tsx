import IComment from "./IComment";
import ICommentLike from "./ICommentLike";
import IFollowArtist from "./IFollowArtist";
import IFollowUser from "./IFollowUser";
import ILike from "./ILike";
import IListenHistory from "./IListenHistory";
import IListenQueue from "./IListenQueue";
import INotification from "./INotification";
import IReview from "./IReview";

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
    queue: IListenQueue[],
    history: IListenHistory[],
    likes: ILike[],
    comments: IComment[],
    commentLikes: ICommentLike[],
    notifications: INotification[],
    actionsPerformed: INotification[]
    stats?: {
        artistsFollowedCount: number
        followersCount: number
        followingCount: number
        releasesListened: number
        reviewsCount: number
    }
}