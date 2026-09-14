import IRelease from "./IRelease";
import IUser from "./IUser";

export default interface ListenQueue {
    userId: string,
    releaseId: string,
    user: IUser,
    release: IRelease
}