import IRelease from "./IRelease";
import IUser from "./IUser";

export default interface Library {
    userId: string,
    releaseId: string,
    user: IUser,
    release: IRelease
}