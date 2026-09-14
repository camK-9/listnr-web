import IReview from "./IReview";
import IUser from "./IUser";

export default interface Like {
    id: string,
    userId: string,
    reviewId: string,
    user: IUser,
    review: IReview
}