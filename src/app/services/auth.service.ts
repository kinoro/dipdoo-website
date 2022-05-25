import { Injectable } from '@angular/core';
import { AuthDataService, LoginRequest } from '../data/auth-data.service';
import { UserAccount } from '../models/user-account';
import { UserAccountDataService } from '../data/user-account-data.service';
import { SharedDataService } from '../data/base/shared-data.service';
import { LikeSummary } from '../models/like-summary';
import { VoteDataService } from '../data/vote-data.service';
import { BlockedUsers } from '../models/blocked-users';
import { BlockedUsersDataService } from '../data/blocked-users-data.service';
import { NotificationSummary } from '../models/notification-summary';
import { AuthEventService, AuthEventType } from './auth-event.service';
import { ClientType } from '../enums/user/client-type';
import { UserAccountLogin } from '../models/user-account-login';
import { PublicStatusDataService } from '../data/public-status-data.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public userAccount: UserAccount;
    public likes: LikeSummary[];
    public blockedUsers: BlockedUsers;
    public hasAttemptedRestore: boolean;

    get isSignedIn() { return this.userAccount != null; }

    constructor(private authEventService: AuthEventService,
        private authData: AuthDataService,
        private publicStatusData: PublicStatusDataService,
        private sharedData: SharedDataService,
        private likeData: VoteDataService,
        private blockedUsersData: BlockedUsersDataService,
        private userAccountData: UserAccountDataService) { }

    async loginAndLoadUserAsync(loginRequest: LoginRequest): Promise<UserAccount> {
        try {
            var tokenData = await this.authData.login2(loginRequest);
            this.sharedData.setTokenData(tokenData);

            await this.tryLoadUserAsync();
            return this.userAccount;
        } catch (err) {
            throw err;
        }
    }

    async refreshAndLoadUserAsync(loginRequest: LoginRequest): Promise<UserAccount> {
        try {
            var tokenData = await this.authData.refresh2(loginRequest.refreshToken);
            this.sharedData.setTokenData(tokenData);

            await this.authData.cleartoken(loginRequest.refreshToken);

            await this.tryLoadUserAsync();
            return this.userAccount;
        } catch (err) {
            throw err;
        }
    }

    async tryRestoreUser(): Promise<UserAccount> {
        if (this.isSignedIn || 
            this.hasAttemptedRestore || 
            this.sharedData.restoreTokenData() == null) 
        {
            this.hasAttemptedRestore = true;
            return Promise.resolve(null);
        }

        var tempTokenData = this.sharedData.tokenData;
        if (!await this.tryLoadUserAsync())
        {
            if (tempTokenData != null && tempTokenData.refreshToken != null) {
                var tokenData = await this.authData.refresh2(tempTokenData.refreshToken);
                this.sharedData.setTokenData(tokenData);

                await this.authData.cleartoken(tempTokenData.refreshToken);

                if (!await this.tryLoadUserAsync()) {
                    this.logout();
                }
            } else {
                this.logout();
            }
        }
        this.hasAttemptedRestore = true;
    }

    async tryLoadUserAsync(): Promise<boolean> {
        try {
            const userAccountLogin: UserAccountLogin = {
                clientType: ClientType.Website,
                clientVersion: ""
            };
            this.userAccount = await this.userAccountData.get(userAccountLogin);
            //this.likes = await this.likeData.getMostRecentForUser();
            //this.blockedUsers = await this.blockedUsersData.getForUser();
            this.authEventService.raiseEvent(AuthEventType.LoggedIn);
            return true;
        } catch (err) {
            this.logout();
            return false;
        }
    }

    logout() {
        this.sharedData.clearTokenData();
        this.userAccount = null;
        this.hasAttemptedRestore = false;
        this.likes = null;
        this.blockedUsers = null;
        this.authEventService.raiseEvent(AuthEventType.LoggedOut);
    }
}
