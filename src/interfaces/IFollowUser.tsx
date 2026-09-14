import IUser from "./IUser";

export default interface FollowUser {
    followerId: string,
    followingId: string,
    follower: IUser,
    following: IUser
}