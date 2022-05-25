import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ViewUserService } from 'src/app/services/view-user.service';
import { BlockedUserService } from 'src/app/services/blocked-user.service';
import { UserTabType } from 'src/app/enums/user/user-tab-type';

@Component({
    selector: 'app-view-user-profile',
    templateUrl: './view-user-profile.component.html',
    styles: []
})
export class ViewUserProfileComponent implements OnInit, OnDestroy {

    get userAccount() { return this.viewUserService.userAccount; }
    get createdAt() { return this.appService.dateString(this.userAccount.createdAt);  }
    get createdAtTimeAgo() { return this.appService.timeSince(this.userAccount.createdAt);  }
    get isBlocked() { return this.blockedUsersService.hasBlockedUser(this.userAccount.username); }
    get isLoggedIn() { return this.appService.isSignedIn; }
    get isFollowing() { return this.viewUserService.isUserFollowingProfileUser; }
    get isFollowingInProgress() { return this.viewUserService.isFollowingInProgress; }

    public isBlockModalActive = false;
    public isToggling = false;
    public userTabTypes: any = UserTabType;

    constructor(private appService: AppService,
                private viewUserService: ViewUserService,
                private blockedUsersService: BlockedUserService) { }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    showBlockModal() {
        this.isBlockModalActive = true;
    }

    cancelBlockModal() {
        this.isBlockModalActive = false;
    }

    async toggleBlocked() {
        this.isToggling = true;

        this.cancelBlockModal();

        try {
            await this.blockedUsersService.toggleBlocked(this.userAccount.username);
            this.isToggling = false;
        } catch (err) {
            this.isToggling = false;
        }
    }

    async follow() {
        await this.viewUserService.follow();
    }

    public switchToPosts() {
        this.appService.navigateTo(`/u/${this.viewUserService.userAccount.username}/${this.viewUserService.getUserTabParam(UserTabType.Posts)}`);
    }

    public switchUserTabType(userTabType: UserTabType) {
        this.appService.navigateTo(`/u/${this.viewUserService.userAccount.username}/${this.viewUserService.getUserTabParam(userTabType)}`);
    }
}
