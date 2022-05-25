import { Injectable } from '@angular/core';
import { RoomHostBaseService } from './base/room-host';
import { AppService } from './app.service';
import { Room } from '../models/room';
import { Post } from '../models/post';
import { PublicPostsDataService } from '../data/public-posts-data.service';
import { PostSummary } from '../models/post-summary';
import { PostListOrderBy } from '../enums/post/post-list-order-by';
import { Observable } from 'rxjs';
import { PostsDataService } from '../data/posts-data.service';
import { AdminPostReportDataService } from '../data/admin-post-report-data.service';
import { ReportedPostSummary } from '../models/reported-post-summary copy';

@Injectable({
    providedIn: 'root'
})
export class ViewReportedPostsService {

    posts: ReportedPostSummary[];
    hasLoadFailed: boolean;
    isLoadingPosts: boolean;

    private pageNumber = 0;
    private lastLoadCount = 0;

    constructor(private appService: AppService,
        private postReportData: AdminPostReportDataService) {
    }

    unload() {
        this.hasLoadFailed = false;
        this.posts = null;
        this.pageNumber = 0;
    }

    async loadAsync(): Promise<ReportedPostSummary[]> {
        this.pageNumber = 0;
        this.posts = await this.loadPostsAsync(0);

        return this.posts;
    }

    async refreshPostsAsync(): Promise<Array<ReportedPostSummary>> {
        this.pageNumber = 0;
        this.posts = null;
        this.posts = await this.loadPostsAsync(0);

        return this.posts;
    }

    async addNextPagePostsAsync(): Promise<Array<ReportedPostSummary>> {
        if (this.lastLoadCount === 0) { return; }

        this.pageNumber ++;
        const newPosts = await this.loadPostsAsync(this.pageNumber);
        if (this.posts == null) {
            this.posts = newPosts;
        } else {
            this.posts.push(...newPosts);
        }

        return this.posts;
    }

    async loadPostsAsync(pageNumber: number): Promise<Array<ReportedPostSummary>> {
        try {
            this.isLoadingPosts = true;
            const loadedPosts = await this.postReportData.get(pageNumber);
            this.lastLoadCount = loadedPosts.length;
            this.isLoadingPosts = false;

            return loadedPosts;
        } catch {
            this.isLoadingPosts = false;
            this.hasLoadFailed = true;

            return null;
        }
    }
}
