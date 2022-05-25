import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { Observable } from 'rxjs';
import { SharedDataService } from './base/shared-data.service';
import { SaveLikeRequest } from '../models/comms/save-like-request';
import { LikeSummary } from '../models/like-summary';
import { NotificationSummary } from '../models/notification-summary';

@Injectable({
  providedIn: 'root'
})
export class NotificationDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async deleteForUser(): Promise<object> {
        return await this.sharedData.delete(`${this.baseUrl}/private/notifications`, this.options());
    }

    public async markNotificationAsSeen(targetType: number, targetId: string): Promise<object> {
        return await this.sharedData.get<object>(`${this.baseUrl}/private/notifications/seen2/${targetType}/${targetId}`, this.options());
    }

    public async getNotifications(): Promise<NotificationSummary[]> {
        return await this.sharedData.get<NotificationSummary[]>(`${this.baseUrl}/private/notifications/all`, this.options());
    }
}
