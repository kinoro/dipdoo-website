import ModelEntity from './base/model-entity';
import { PostDeployStatus } from '../enums/post/post-deploy-status';
import { TargetType } from '../enums/notification/target-type';

export class NotificationSummary extends ModelEntity
{
    public targetType: TargetType;
    public targetId: string;
    public username: string;
    public targetUsername: string;
    public postDPId: string;
    public announcementId: number;
    public postRoom: string;
    public imageURL: string;
    public userImageURL: string;
    public numLikes: number;
    public numComments: number;
    public numReports: number;
    public numAnnouncements: number;
    public seen: Boolean;
    public mostRecentCreatedAt: Date;
}