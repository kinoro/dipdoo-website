import ModelEntity from './base/model-entity';

export class Comment extends ModelEntity {
    public userAccountId: string;
    public username: string;
    public text: string;
    public parentCommentId?: string;
    public numSubComments?: number;
    public subComments: Comment[];
    public postId: string;
    public commentedAt: Date;

    public pageNumber?: number;
    public lastLoadCount?: number;
    public isReplying?: boolean;
}