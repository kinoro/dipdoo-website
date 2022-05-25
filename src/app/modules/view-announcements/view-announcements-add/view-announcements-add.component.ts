import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Announcement } from 'src/app/models/announcement';
import { ViewAnnouncementsService } from 'src/app/services/view-announcements.service';

@Component({
    selector: 'app-view-announcements-add',
    templateUrl: './view-announcements-add.component.html',
    styles: [`
    `]
})
export class ViewAnnouncementsAddComponent implements OnInit {

    public announcement: Announcement;
    public startDate: string;
    public endDate: string;

    public isSaving: boolean;

    constructor(private appService: AppService,
                private viewAnnouncementService: ViewAnnouncementsService) { }

    ngOnInit() {
        this.clear();
    }

    clear() {
        this.announcement = new Announcement();
        this.startDate = this.dateToMinDateString(this.daysInFuture(1));
        this.endDate = this.dateToMinDateString(this.daysInFuture(2));
    }

    async save() {
        if (this.canParseDate(this.startDate) &&
            this.canParseDate(this.endDate)) {

            try {
                this.isSaving = true;
                this.announcement.startedAt = new Date(this.startDate);
                this.announcement.endedAt = new Date(this.endDate);
                await this.viewAnnouncementService.save(this.announcement);
                this.viewAnnouncementService.refreshAsync();
                this.clear();
            } finally {
                this.isSaving = false;
            }
        }
    }

    parseDate(dateString: string) {
        return Date.parse(dateString);
    }

    canParseDate(dateString: string) {
        return dateString != null && dateString.length > 0 && !isNaN(this.parseDate(dateString));
    }

    dateToMinDateString(date: Date): string {
        return date.getUTCFullYear() + "-" + this.zeroed(date.getUTCMonth() + 1) + "-" + this.zeroed(date.getUTCDate()) + "T00:00:00Z";
    }

    zeroed(num: number) { return num < 10 ? "0" + num.toString() : num.toString(); }

    daysInFuture(numDays: number): Date {
        var result = new Date();
        result.setDate(result.getDate() + numDays);
        return result;
    }
}
