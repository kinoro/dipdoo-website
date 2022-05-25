import { Injectable } from '@angular/core';
import { RoomHostBaseService } from './base/room-host';
import { AppService } from './app.service';
import { Room } from '../models/room';
import { PublicPostsDataService } from '../data/public-posts-data.service';
import { PostSummary } from '../models/post-summary';
import { PostListOrderBy } from '../enums/post/post-list-order-by';
import { Observable } from 'rxjs';
import { PostsDataService } from '../data/posts-data.service';
import { RoomSummary } from '../models/room-summary';
import { PublicRoomsDataService } from '../data/public-rooms-data.service';
import { ViewAnnouncementsService } from './view-announcements.service';
import { RoomType } from '../enums/post/room-type';
import { Post } from '../models/post';
import { PostListFilterBy } from '../enums/post/post-list-filter-by';

@Injectable({
    providedIn: 'root'
})
export class ViewPostsService {

    posts: Array<Post>;
    hasLoadFailed: boolean;
    isLoadingPosts: boolean;
    isServerUnavailable: boolean;
    orderBy: PostListOrderBy;
    pinnedRooms: RoomSummary[] = [];
    tag: string;

    get canLoadMore() { return this.posts != null && this.posts.length > 0 && this.lastLoadCount > 0; }

    private pageNumber = 1;
    private lastLoadCount = 0;

    constructor(private appService: AppService,
        private postsData: PostsDataService,
        private publicPostsData: PublicPostsDataService,) {
    }

    unload() {
        this.hasLoadFailed = false;
        this.posts = null;
        this.pageNumber = 1;
    }

    async initAsync(orderBy: PostListOrderBy, tag: string): Promise<Array<Post>> {
        this.orderBy = orderBy;
        this.pageNumber = 1;
        this.tag = tag;
        this.posts = await this.loadPostsAsync();

        return this.posts;
    }

    async refreshPostsAsync(): Promise<Array<Post>> {
        this.pageNumber = 1;
        this.posts = null;
        this.posts = await this.loadPostsAsync();

        return this.posts;
    }

    async addNextPagePostsAsync(): Promise<Array<Post>> {
        if (this.lastLoadCount === 0) { return; }

        this.pageNumber ++;
        const newPosts = await this.loadPostsAsync();
        if (this.posts == null) {
            this.posts = newPosts;
        } else {
            this.posts.push(...newPosts);
        }

        return this.posts;
    }

    async loadPostsAsync(): Promise<Array<Post>> {
        try {
            this.isLoadingPosts = true;
            this.isServerUnavailable = false;
            const loadedPosts = await this.getPostsMethod(this.pageNumber);
            this.lastLoadCount = loadedPosts.length;
            this.isLoadingPosts = false;

            return loadedPosts;
        } catch (err) {
            if (err.name == "HttpErrorResponse" && err.message.startsWith("Http failure response")) {
                this.isServerUnavailable = true;
            }
            this.isLoadingPosts = false;
            this.hasLoadFailed = true;

            return null;
        }
    }

    private getPostsMethod(pageNumber: number): Promise<Post[]> {
        return this.appService.isSignedIn
                ? this.postsData.get(this.orderBy, PostListFilterBy.Tag, pageNumber, this.tag)
                : this.publicPostsData.get(this.orderBy, PostListFilterBy.Tag, pageNumber, this.tag);
    }

    public getOrderBy(orderByParam: string): PostListOrderBy {
        if (orderByParam != null && orderByParam == "hot") {
            return PostListOrderBy.Hot;
        } else {
            return PostListOrderBy.Latest;
        }
    }

    public getOrderByParam(orderBy: PostListOrderBy): string {
        if (orderBy == PostListOrderBy.Latest) {
            return 'latest';
        } else if (orderBy == PostListOrderBy.Hot) {
            return 'hot';
        }
    }
}
