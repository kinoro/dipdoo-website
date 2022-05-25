import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ViewUserService } from 'src/app/services/view-user.service';
import { UserTabType } from 'src/app/enums/user/user-tab-type';
import { UserAccount } from 'src/app/models/user-account';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-view-user',
    templateUrl: './view-user.component.html',
    styles: [`
        .hero-body .container .title {
            text-transform: capitalize;
        }

        .mobile-button-max-width {
            max-width: 105px;
        }
    `]
})
export class ViewUserComponent implements OnInit {

    @Input() username: string;
    @Input() userTabType: string;

    get isDesktop(): boolean { return this.appService.isDesktop; }
    get userAccount(): UserAccount { return this.viewUserService.userAccount; }
    get numPosts(): number { return this.userAccount == null ? 0 : this.userAccount.numPosts; }
    get numFollowers(): number { return this.userAccount == null ? 0 : this.userAccount.numFollowers; }
    get numFollowing(): number { return this.userAccount == null ? 0 : this.userAccount.numFollowing; }
    get hasLoaded(): boolean { return this.userAccount != null; }
    get hasFailed(): boolean { return this.viewUserService.hasLoadFailed; }
    get canShowEditProfile(): boolean { return this.authService.isSignedIn && this.authService.userAccount.username === this.username; }
    public userTabTypeEnum: any = UserTabType;

    constructor(private viewUserService: ViewUserService,
                private authService: AuthService,
                private appService: AppService) { }

    ngOnInit() {
        this.viewUserService.unload();
        this.viewUserService.loadUserAsync(this.username, this.viewUserService.getUserTabType(this.userTabType));
    }

    public isTabSelected(userTabType: UserTabType) {
        return this.viewUserService.userTabType === userTabType;
    }

    public isUserTabType(userTabType: UserTabType) {
        return userTabType === this.viewUserService.userTabType;
    }

    public switchUserTabType(userTabType: UserTabType) {
        this.appService.navigateTo(`/u/${this.viewUserService.userAccount.username}/${this.viewUserService.getUserTabParam(userTabType)}`);
    }
}
