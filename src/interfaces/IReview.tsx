import ILike from "./ILike";
import IRelease from "./IRelease";
import IUser from "./IUser";
import IComment from "./IComment";

export default interface Review {
    id: string,
    rating: number,
    comment?: string,
    userId: string,
    releaseId: string,
    user: IUser,
    release: IRelease,
    likes: ILike[],
    comments: IComment[]
}