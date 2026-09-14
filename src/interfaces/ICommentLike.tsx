import IComment from "./IComment";
import IUser from "./IUser";

export default interface CommentLike {
    id: string,
    userId: string,
    commentId: string,
    user: IUser,
    comment: IComment
}