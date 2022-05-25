import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BlockedUsersDataService } from '../data/blocked-users-data.service';

@Injectable({
    providedIn: 'root'
})
export class BlockedUserService {

    constructor(private authService: AuthService,
        private blockedUsersData: BlockedUsersDataService) { }

    async toggleBlocked(username: string) {
        if (this.hasBlockedUser(username)) {
            await this.blockedUsersData.unblock(username);
            this.authService.blockedUsers.usernames = this.authService.blockedUsers.usernames.filter(u => u !== username);
        } else {
            await this.blockedUsersData.block(username);
            this.authService.blockedUsers.usernames.push(username);
        }
    }

    hasBlockedUser(usernameToBlock: string) {
        return this.authService.isSignedIn &&
            this.authService.blockedUsers != null && this.authService.blockedUsers.usernames != null &&
            this.authService.blockedUsers.usernames.find(u => u === usernameToBlock) != null;
    }
}
