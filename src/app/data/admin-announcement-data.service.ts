import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { SharedDataService } from './base/shared-data.service';
import { Announcement } from '../models/announcement';

@Injectable({
  providedIn: 'root'
})
export class AdminAnnouncementDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async post(announcement: Announcement): Promise<object> {
        return await this.sharedData.post<object>(`${this.baseUrl}/admin/announcement`, announcement, this.options());
    }
}
