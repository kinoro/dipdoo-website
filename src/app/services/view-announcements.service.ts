import { Injectable } from '@angular/core';
import { RoomHostBaseService } from './base/room-host';
import { AppService } from './app.service';
import { Room } from '../models/room';
import { Post } from '../models/post';
import { PublicPostsDataService } from '../data/public-posts-data.service';
import { PostSummary } from '../models/post-summary';
import { PostListOrderBy } from '../enums/post/post-list-order-by';
import { Observable } from 'rxjs';
import { PostsDataService } from '../data/posts-data.service';
import { AdminPostReportDataService } from '../data/admin-post-report-data.service';
import { ReportedPostSummary } from '../models/reported-post-summary copy';
import { AdminAnnouncementDataService } from '../data/admin-announcement-data.service';
import { PublicAnnouncementsDataService } from '../data/public-announcements-data.service';
import { Announcement } from '../models/announcement';

@Injectable({
    providedIn: 'root'
})
export class ViewAnnouncementsService {

    announcements: Announcement[];
    hasLoadFailed: boolean;
    isLoading: boolean;
    lastLoadAt: Date;
    loadEveryXMinutes: 60;

    constructor(private appService: AppService,
        private adminAnnouncementData: AdminAnnouncementDataService,
        private publicAnnouncementsData: PublicAnnouncementsDataService) {
    }

    unload() {
        this.hasLoadFailed = false;
        this.announcements = null;
    }

    async loadAsync() {
        if (this.lastLoadAt == null || 
            this.addMinutes(this.lastLoadAt, this.loadEveryXMinutes) < new Date()) {

            await this.refreshAsync();
            this.lastLoadAt = new Date();
        }
    }

    async refreshAsync(): Promise<Announcement[]> {
        this.announcements = await this.loadAnnouncementsAsync();
        return this.announcements;
    }

    async save(announcement: Announcement) {
        return await this.adminAnnouncementData.post(announcement);
    }

    async loadAnnouncementsAsync(): Promise<Array<Announcement>> {
        try {
            this.isLoading = true;
            const loadedAnnouncements = await this.publicAnnouncementsData.getCurrent();
            this.isLoading = false;

            return loadedAnnouncements;
        } catch {
            this.isLoading = false;
            this.hasLoadFailed = true;

            return null;
        }
    }

    addMinutes(date: Date, numMinutes: number): Date {
        if (date == null) return null;

        var dateCopy = new Date(date.valueOf());
        dateCopy.setMinutes(dateCopy.getMinutes() + this.loadEveryXMinutes);

        return dateCopy;
    }
}
