import ModelEntity from './base/model-entity';

export class UserAccount extends ModelEntity {
    username: string;
    email: string;
    isAdmin: boolean;
    isEmailConfirmed: boolean;
    refreshToken: string;
    numPosts: number;
    numComments: number;
    numFollowers: number;
    numFollowing: number;
    showReportedPosts: boolean;
    sendNotificationSummaryByEmail: boolean;
    sendNotificationForNewPosts: boolean;
    sendNotificationForNewFollowers: boolean;
    isFollowedByRequester: boolean;
    children: Array<UserAccountRef>;
}

export class UserAccountRef {
    id: string;
    username: string;
}
