import ModelEntity from './base/model-entity';
import { PostDeployStatus } from '../enums/post/post-deploy-status';

export class PostSummary extends ModelEntity {
    public dpId: string;
    public username: string;
    public room: string;
    public title: string;
    public titleId: string;
    public description: string;
    public url: string;
    public deployStatus: PostDeployStatus;
    public createdAt: Date;
    public updatedAt: Date;

    public numComments: number;
    public numLikes: number;
}