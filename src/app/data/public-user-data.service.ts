import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { SharedDataService } from './base/shared-data.service';
import { Observable } from 'rxjs';
import { UserAccount } from '../models/user-account';

@Injectable({
  providedIn: 'root'
})
export class PublicUserDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async getByUsername(username: string): Promise<UserAccount> {
        return await this.sharedData.get<UserAccount>(`${this.baseUrl}/public/useraccount/${username}`, this.options());
    }

    public async getUserFollowingOrFollowers(username: string, followingOrFollowers: "followers" | "following", startFrom: number): Promise<UserAccount[]> {
        if (followingOrFollowers != "following" && followingOrFollowers != "followers")
        {
            throw 'can only be following/followers';
        }
        return await this.sharedData.get<UserAccount[]>(`${this.baseUrl}/public/useraccount/${followingOrFollowers}/${username}/${startFrom}`, this.options());
    }
}