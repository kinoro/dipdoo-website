import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Announcement } from 'src/app/models/announcement';
import { ViewAnnouncementsService } from 'src/app/services/view-announcements.service';

@Component({
    selector: 'app-view-announcements-announcement',
    templateUrl: './view-announcements-announcement.component.html',
    styles: [`
    `]
})
export class ViewAnnouncementsAnnouncementComponent implements OnInit, OnDestroy {

    @Input() announcement: Announcement;

    public isSaving: boolean;
    public isSaved: boolean;

    constructor(private appService: AppService,
                private viewAnnouncementService: ViewAnnouncementsService) { }

    ngOnInit() {
    }

    ngOnDestroy() {
    }


}
