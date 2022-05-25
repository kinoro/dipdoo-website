import { Injectable } from '@angular/core';
import { UserAccount } from '../models/user-account';
import { PostSummary } from '../models/post-summary';
import { UserTabType } from '../enums/user/user-tab-type';
import { PublicUserDataService } from '../data/public-user-data.service';
import { PublicPostsDataService } from '../data/public-posts-data.service';
import { AppService } from './app.service';
import { UserAccountDataService } from '../data/user-account-data.service';
import { PostsDataService } from '../data/posts-data.service';
import { FollowParams } from '../models/follow-params';
import { UserAccountUpdate } from '../models/comms/user-account-update';

@Injectable({
    providedIn: 'root'
})
export class ViewUserService {
    public hasLoadFailed: boolean;
    public hasLoadPostsFailed: boolean;
    public hasLoadUsersFailed: Record<"following" | "followers", boolean> = { followers: false, following: false };
    public posts: PostSummary[];
    public users: Record<"following" | "followers", UserAccount[]> = { followers: null, following: null };
    public userAccount: UserAccount;
    public username: string;
    public isLoadingPosts: boolean;
    public isLoadingUsers: Record<"following" | "followers", boolean> = { followers: false, following: false };
    public isUserFollowingProfileUser: boolean;
    public isFollowingInProgress: boolean;

    public get userTabType(): UserTabType { return this.pUserTabType; }

    private pageNumber = 0;
    private usersPageNumber: Record<"following" | "followers", number> = { followers: 0, following: 0 }; 
    private lastLoadCount = 0;
    private usersLastLoadCount: Record<"following" | "followers", number> = { followers: 0, following: 0 }; 
    private pUserTabType: UserTabType;

    constructor(private publicUserData: PublicUserDataService,
                private userData: UserAccountDataService,
                private postsData: PostsDataService,
                private publicPostsData: PublicPostsDataService,
                private appService: AppService) { }

    unload() {
        this.hasLoadFailed = false;
        this.hasLoadPostsFailed = false;
        this.hasLoadUsersFailed = { followers: false, following: false };
        this.posts = null;
        this.userAccount = null;
        this.username = null;
        this.users = { followers: null, following: null };
        this.pageNumber = 0;
        this.usersPageNumber = { followers: 0, following: 0 };
        this.lastLoadCount = 0;
        this.usersLastLoadCount = { followers: 0, following: 0 };
        this.isFollowingInProgress = false;
    }

    async loadUserAsync(username: string, userTabType: UserTabType): Promise<UserAccount> {
        try {
            this.username = username;
            const loadMethod = this.appService.isSignedIn
                ? this.userData.getByUsername(username)
                : this.publicUserData.getByUsername(username);
            this.userAccount = await loadMethod;
            this.isUserFollowingProfileUser = this.userAccount.isFollowedByRequester;
            await this.updateUserTabType(userTabType);
            return this.userAccount;
        } catch {
            this.hasLoadFailed = true;
            return null;
        }
    }

    public async updateUserTabType(userTabType: UserTabType) {
        this.pUserTabType = userTabType;

        if (this.pUserTabType === UserTabType.Posts && this.posts == null) {
            await this.refreshPostsAsync();
        } else if (this.pUserTabType === UserTabType.Followers && this.users["followers"] == null) {
            await this.refreshUserSummarysAsync("followers");
        } else if (this.pUserTabType === UserTabType.Following && this.users["following"] == null) {
            await this.refreshUserSummarysAsync("following");
        }
    }

    public getUserTabType(userTabParam: string): UserTabType {
        if (userTabParam == null || userTabParam.length === 0) {
            return UserTabType.Profile;
        } else if (userTabParam === 'posts') {
            return UserTabType.Posts;
        } else if (userTabParam === 'following') {
            return UserTabType.Following;
        } else if (userTabParam === 'followers') {
            return UserTabType.Followers;
        }
    }

    public getUserTabParam(userTabType: UserTabType): string {
        if (userTabType === UserTabType.Profile) {
            return '';
        } else if (userTabType === UserTabType.Posts) {
            return 'posts';
        } else if (userTabType === UserTabType.Followers) {
            return 'followers';
        } else if (userTabType === UserTabType.Following) {
            return 'following';
        }
    }

    public async update() {
        var userAccountUpdate = new UserAccountUpdate();
        userAccountUpdate.username = this.userAccount.username;
        userAccountUpdate.showReportedPosts = this.userAccount.showReportedPosts;
        userAccountUpdate.sendNotificationSummaryByEmail = this.userAccount.sendNotificationSummaryByEmail;
        userAccountUpdate.sendNotificationForNewFollowers = this.userAccount.sendNotificationForNewFollowers;
        userAccountUpdate.sendNotificationForNewPosts = this.userAccount.sendNotificationForNewPosts;
        await this.userData.update(this.userAccount);
    }

    async refreshPostsAsync(): Promise<Array<PostSummary>> {
        this.pageNumber = 0;
        this.posts = null;
        this.posts = await this.loadPostsAsync(0);

        return this.posts;
    }

    async addNextPagePostsAsync(): Promise<Array<PostSummary>> {
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

    async loadPostsAsync(pageNumber: number): Promise<Array<PostSummary>> {
        try {
            this.isLoadingPosts = true;
            const loadPostsMethod = this.appService.isSignedIn
                ? this.postsData.getForUser(this.username, pageNumber)
                : this.publicPostsData.getForUser(this.username, pageNumber);
            const loadedPosts = await loadPostsMethod;
            this.lastLoadCount = loadedPosts.length;
            this.isLoadingPosts = false;

            return loadedPosts;
        } catch {
            this.isLoadingPosts = false;
            this.hasLoadPostsFailed = true;

            return null;
        }
    }

    
    async refreshUserSummarysAsync(followersOrFollowing: "followers" | "following"): Promise<Array<UserAccount>> {
        this.usersPageNumber[followersOrFollowing] = 0;
        this.users[followersOrFollowing] = await this.loadUserSummarysAsync(0, followersOrFollowing);

        return this.users[followersOrFollowing];
    }

    async addNextPageUsersAsync(followersOrFollowing: "followers" | "following"): Promise<Array<UserAccount>> {
        if (this.usersLastLoadCount[followersOrFollowing] === 0) { return; }

        this.usersPageNumber[followersOrFollowing] ++;
        const newUsers = await this.loadUserSummarysAsync(this.pageNumber, followersOrFollowing);
        if (this.users[followersOrFollowing] == null) {
            this.users[followersOrFollowing] = newUsers;
        } else {
            this.users[followersOrFollowing].push(...newUsers);
        }

        return this.users[followersOrFollowing];
    }

    async loadUserSummarysAsync(pageNumber: number, followersOrFollowing: "followers" | "following"): Promise<Array<UserAccount>> {
        try {
            this.isLoadingUsers[followersOrFollowing] = true;
            const loadedUsers = await this.publicUserData.getUserFollowingOrFollowers(this.username, followersOrFollowing, pageNumber);
            this.usersLastLoadCount[followersOrFollowing] = loadedUsers.length;
            this.isLoadingUsers[followersOrFollowing] = false;

            return loadedUsers;
        } catch {
            this.isLoadingUsers[followersOrFollowing] = false;
            this.hasLoadUsersFailed[followersOrFollowing] = true;

            return null;
        }
    }

    async follow() {
        this.isFollowingInProgress = true;

        try {
            var followParams = new FollowParams();
            followParams.isFollow = !this.isUserFollowingProfileUser;
            followParams.username = this.appService.username;
            followParams.usernameToFollowOrUnfollow = this.userAccount.username;

            await this.userData.follow(followParams);

            this.isUserFollowingProfileUser = !this.isUserFollowingProfileUser;
        } finally {
            this.isFollowingInProgress = false;
        }
    }
}
