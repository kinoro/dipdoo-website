import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { PublicPostsDataService } from '../data/public-posts-data.service';
import { PostSummary } from '../models/post-summary';
import { PostsDataService } from '../data/posts-data.service';

@Injectable({
    providedIn: 'root'
})
export class SearchPostsService {

    tagsSearchString: string;
    posts: Array<PostSummary>;
    hasLoadFailed: boolean;
    isLoadingPosts: boolean;
    isEmpty: boolean;
    errorMessage: string;

    private pageNumber = 0;
    private lastLoadCount = 0;

    constructor(private appService: AppService,
        private postsData: PostsDataService,
        private publicPostsData: PublicPostsDataService) {}

    unload() {
        this.hasLoadFailed = false;
        this.posts = null;
        this.pageNumber = 0;
        this.tagsSearchString = null;
        this.isEmpty = false;
        this.errorMessage = '';
    }

    loadEmpty() {
        this.isEmpty = true;
        this.posts = [];
    }

    validateSearchTerm(tagsSearchString: string): string {
        var invalidCharactersRegex = /^[a-z0-9 ]+$/i;
        if (tagsSearchString == null || tagsSearchString.trim().length == 0) {
            return 'Please enter a search term';
        } else if (!invalidCharactersRegex.test(tagsSearchString.trim())) {
            return 'Search term can only contain letters, number and spaces'
        }

        return '';
    }

    async searchAsync(tagsSearchString: string): Promise<Array<PostSummary>> {

        this.errorMessage = this.validateSearchTerm(tagsSearchString);
        if (this.errorMessage.length > 0)
        {
            this.hasLoadFailed = true;
            this.loadEmpty();
            return [];
        }

        this.tagsSearchString = tagsSearchString.trim();
        this.pageNumber = 0;
        this.isEmpty = false;
        this.hasLoadFailed = false;
        this.posts = await this.loadPostsAsync(0, this.tagsSearchString);

        return this.posts;
    }

    async refreshPostsAsync(): Promise<Array<PostSummary>> {
        this.pageNumber = 0;
        this.posts = null;
        this.posts = await this.loadPostsAsync(0, this.tagsSearchString);

        return this.posts;
    }

    async addNextPagePostsAsync(): Promise<Array<PostSummary>> {
        if (this.lastLoadCount === 0) { return; }

        this.pageNumber ++;
        const newPosts = await this.loadPostsAsync(this.pageNumber, this.tagsSearchString);
        if (this.posts == null) {
            this.posts = newPosts;
        } else {
            this.posts.push(...newPosts);
        }

        return this.posts;
    }

    async loadPostsAsync(pageNumber: number, tagsSearchString: string): Promise<Array<PostSummary>> {
        try {
            this.isLoadingPosts = true;
            const loadedPosts = await this.publicPostsData.search(pageNumber, tagsSearchString);
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
