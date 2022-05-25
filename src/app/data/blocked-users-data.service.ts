import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { Observable } from 'rxjs';
import { SharedDataService } from './base/shared-data.service';
import { BlockedUsers } from '../models/blocked-users';

@Injectable({
  providedIn: 'root'
})
export class BlockedUsersDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async block(username): Promise<object> {
        return await this.sharedData.get<object>(`${this.baseUrl}/private/blockedusers/block/${username}`, this.options());
    }

    public async unblock(username): Promise<object> {
        return await this.sharedData.get<object>(`${this.baseUrl}/private/blockedusers/unblock/${username}`, this.options());
    }

    public async getForUser(): Promise<BlockedUsers> {
        return await this.sharedData.get<BlockedUsers>(`${this.baseUrl}/private/blockedusers`, this.options());
    }
}
