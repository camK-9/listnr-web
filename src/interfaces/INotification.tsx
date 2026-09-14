import IUser from "./IUser"

enum NotificationType {
    NEW_RELEASE,
    REVIEW_LIKE,
    COMMENT_LIKE,
    NEW_COMMENT,
    NEW_REPLY,
    NEW_FOLLOWER
}

export default interface Notification {
    id: string
    type: NotificationType,
    userId: string,
    actorId?: string,
    targetId?: string,
    message: string,
    isRead: boolean
    user: IUser,
    actor?: IUser
}