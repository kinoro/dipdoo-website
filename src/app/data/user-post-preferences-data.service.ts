import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { Observable } from 'rxjs';
import { SharedDataService } from './base/shared-data.service';
import { UserPostPreferences } from '../models/user-post-preferences';

@Injectable({
  providedIn: 'root'
})
export class UserPostPreferencesDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async save(userPostPreferences: UserPostPreferences): Promise<object> {
        return await this.sharedData.post(`${this.baseUrl}/private/userPostPreferences/`, userPostPreferences, this.options());
    }

    public async get(postDPId: string): Promise<UserPostPreferences> {
        return await this.sharedData.get<UserPostPreferences>(`${this.baseUrl}/private/userPostPreferences/${postDPId}`, this.options());
    }
}
