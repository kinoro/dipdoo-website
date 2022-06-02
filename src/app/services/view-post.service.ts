import { Injectable } from '@angular/core';
import { RoomHostBaseService } from './base/room-host';
import { AppService } from './app.service';
import { Room } from '../models/room';
import { Post } from '../models/post';
import { PublicPostsDataService } from '../data/public-posts-data.service';
import { PostSummary } from '../models/post-summary';
import { Comment } from '../models/comment';
import { PublicCommentsDataService } from '../data/public-comments-data.service';
import { UserPostPreferences } from '../models/user-post-preferences';
import { UserPostPreferencesDataService } from '../data/user-post-preferences-data.service';
import { AuthService } from './auth.service';
import { PostTagSummaryDataService } from '../data/post-tag-summary-data.service';
import { PostTagSummary } from '../models/post-tag-summary';
import { TagService } from './tag.service';
import { CommentParentType } from '../enums/comment/comment-parent-type';
import { PostsDataService } from '../data/posts-data.service';

@Injectable({
    providedIn: 'root'
})
export class ViewPostService extends RoomHostBaseService {

    hasLoadFailed: boolean;
    post: Post;
    comments: Array<Comment>;
    tags: string;
    tagList: Array<string>;
    userPostPreferences: UserPostPreferences;
    isSavingTags = false;

    private commentPageNumber = 0;
    private commentLastLoadCount = 0;

    get canEdit() {
        return this.authService.userAccount != null &&
        (this.authService.userAccount.isAdmin || this.post.username === this.appService.username);
    }
    get hasLoadedTags() { return this.tags != null; }

    constructor(private appService: AppService,
                private authService: AuthService,
                private publicPostsData: PublicPostsDataService,
                private postsData: PostsDataService,
                private publicCommentsData: PublicCommentsDataService,
                private userPostPreferencesData: UserPostPreferencesDataService,) {

        super();
    }

    unload() {
        this.hasLoadFailed = false;
        this.post = null;
        this.comments = null;
        this.userPostPreferences = null;
        this.commentPageNumber = 0;
    }

    async setCommentNotificationsActive(isActive) {
        this.userPostPreferences.areCommentNotificationsOn = isActive;
        await this.userPostPreferencesData.save(this.userPostPreferences);
    }

    async loadAllPostAsync(friendlyId: string): Promise<Post> {
        this.hasLoadFailed = false;
        this.commentPageNumber = 0;
        this.commentLastLoadCount = 0;

        const id = this.extractId(friendlyId);
        console.log(`friendly id is ${friendlyId}, extracted id ${id}`);
        this.post = await this.loadPostAsync(id);
        /*
        if (!this.hasLoadFailed) {
            this.userPostPreferences = new UserPostPreferences();
        }
        */
        if (!this.hasLoadFailed) {
            await this.addNextPageCommentsAsync(id);
        }

        return this.post;
    }

    extractId(friendlyId: string): string {
        const parts = friendlyId.split('-');
        return parts[parts.length - 1];
    }

    private async loadPostAsync(id: string): Promise<Post> {
        try {
            const post = this.appService.isSignedIn
                ? await this.postsData.getSingle(id)
                : await this.publicPostsData.getSingle(id);
            return post;
        } catch {
            this.hasLoadFailed = true;
            return null;
        }
    }

    async refreshCommentsForPost(): Promise<Array<Comment>> {
        this.comments = null;
        this.commentPageNumber = 0;
        this.commentLastLoadCount = 0;
        return await this.addNextPageCommentsAsync(this.post.id);
    }

    async refreshCommentsForComment(comment: Comment): Promise<Array<Comment>> {
        comment.subComments = null;
        comment.pageNumber = 0;
        comment.lastLoadCount = 0;
        return await this.addNextPageCommentsForCommentAsync(comment);
    }

    async addNextPageCommentsAsync(postId: string): Promise<Array<Comment>> {
        if (this.comments != null && this.commentLastLoadCount === 0) { return; }

        try {
            this.commentPageNumber ++;
            const newComments = await this.publicCommentsData.get(CommentParentType.Post, postId, this.commentPageNumber);
            this.commentLastLoadCount = (newComments || []).length;
            if (this.comments == null) {
                this.comments = newComments;
            } else {
                this.comments.push(...newComments);
            }

            return this.comments;
        } catch {
            this.commentPageNumber --;
            if (this.comments == null) {
                this.hasLoadFailed = true;
            }
            return null;
        }
    }

    async addNextPageCommentsForCommentAsync(comment: Comment): Promise<Array<Comment>> {
        if (comment.subComments != null && comment.lastLoadCount === 0) { return; }

        try {
            if (comment.pageNumber == null) { comment.pageNumber = 0; }
            comment.pageNumber ++;
            const newComments = await this.publicCommentsData.get(CommentParentType.Comment, comment.id, comment.pageNumber);
            comment.lastLoadCount = (newComments || []).length;
            if (comment.subComments == null) {
                comment.subComments = newComments;
            } else {
                comment.subComments.push(...newComments);
            }

            return comment.subComments;
        } catch {
            comment.pageNumber --;
            return null;
        }
    }

    private onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
}
