import ICommentLike from "./ICommentLike";
import IReview from "./IReview";
import IUser from "./IUser";

export default interface Comment {
    id: string,
    content: string,
    userId: string,
    reviewId: string,
    user: IUser,
    review: IReview,
    parentId?: string,
    parent?: Comment,
    replies?: Comment[],
    likes: ICommentLike[]
}