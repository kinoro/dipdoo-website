import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { Observable } from 'rxjs';
import { UserAccount } from '../models/user-account';
import { SharedDataService } from './base/shared-data.service';
import { FollowParams } from '../models/follow-params';
import { UserAccountUpdate } from '../models/comms/user-account-update';
import { UserAccountLogin } from '../models/user-account-login';

@Injectable({
  providedIn: 'root'
})
export class UserAccountDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async get(userAccountLogin: UserAccountLogin): Promise<UserAccount> {
        return await this.sharedData.post<UserAccount>(`${this.baseUrl}/private/userAccount/login`, userAccountLogin, this.options());
    }

    public async getByUsername(username: string): Promise<UserAccount> {
        return await this.sharedData.get<UserAccount>(`${this.baseUrl}/private/useraccount/${username}`, this.options());
    }

    public async update(userAccountUpdate: UserAccountUpdate): Promise<UserAccount> {
        return await this.sharedData.post<UserAccount>(`${this.baseUrl}/private/useraccount`, userAccountUpdate, this.options());
    }

    public async follow(followParams: FollowParams): Promise<string> {
        return await this.sharedData.post<string>(`${this.baseUrl}/private/useraccount/follow`, followParams, this.options(true));
    }
}
