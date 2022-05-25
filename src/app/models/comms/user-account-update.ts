import ModelEntity from '../base/model-entity';

export class UserAccountUpdate {
    username: string;
    showReportedPosts: boolean;
    sendNotificationSummaryByEmail: boolean;
    sendNotificationForNewPosts: boolean;
    sendNotificationForNewFollowers: boolean;
}
