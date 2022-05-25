import { ContentType } from './content-type';

export class Post
{
    public id?: string;
    public userAccountId: string;
    public username?: string;
    public title: string;
    public details?: string;
    public tags?: Array<string>;
    public contentType: ContentType;
    public linkUrl?: string;
    public imageUrl?: string;
    public ctaText?: string;
    public ctaUrl?: string;
    public publishDate: Date;
    public numVotes: number;
    public numComments: number;
    public options: Array<PostOption>;
    public hasUserVoted?: boolean;
}

export class PostOption {
    public id: number;
    public contentType: ContentType;
    public text?: string;
    public linkUrl?: string;
    public imageUrl?: string;
    public numVotes: number;
    public hasUserVoted?: boolean;

    public hasImageLoaded?: boolean;
    public isPortrait?: boolean;
}