import ModelEntity from './base/model-entity';

export class CommentSummary extends ModelEntity
{
    public dpid: string;
    public username: string;
    public text: string;
    public parentCommentDpid: string;
}