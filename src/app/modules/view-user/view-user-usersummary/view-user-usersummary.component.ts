import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { UserAccount } from 'src/app/models/user-account';
import { UserTabType } from 'src/app/enums/user/user-tab-type';
import { ViewUserService } from 'src/app/services/view-user.service';

@Component({
    selector: 'app-view-user-usersummary',
    templateUrl: './view-user-usersummary.component.html',
    styles: [``]
})
export class ViewUserUserSummaryComponent implements OnInit, OnDestroy {

    @Input() user: UserAccount;

    get posts() { return `Posts (${this.user.numPosts})`; }
    get followers() { return `Followers (${this.user.numFollowers})`; }
    get following() { return `Following (${this.user.numFollowing})`; }

    userTabTypes: any = UserTabType;

    constructor(private appService: AppService,
        private viewUserService: ViewUserService) { }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    openUser() {
        this.appService.navigateTo(`/u/${this.user.username}`);
    }

    getUserProfileImageUrl() {
        return this.appService.getUserImageUrl(this.user);
    }

    switchUserTabType(userTabType: UserTabType) {
        this.appService.navigateTo(`/u/${this.user.username}/${this.viewUserService.getUserTabParam(userTabType)}`);
    }
}
