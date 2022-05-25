import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { SharedDataService } from './base/shared-data.service';
import { Announcement } from '../models/announcement';

@Injectable({
  providedIn: 'root'
})
export class PublicAnnouncementsDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async getCurrent(): Promise<Array<Announcement>> {
        return await this.sharedData.get<Array<Announcement>>(`${this.baseUrl}/public/announcements`, this.options());
    }
}