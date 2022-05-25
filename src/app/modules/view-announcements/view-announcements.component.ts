import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ViewAnnouncementsService } from 'src/app/services/view-announcements.service';
import { Announcement } from 'src/app/models/announcement';

@Component({
    selector: 'app-view-announcements',
    templateUrl: './view-announcements.component.html',
    styles: [`
        .hero-body .container .title {
            text-transform: capitalize;
        }
    `]
})
export class ViewAnnouncementsComponent implements OnInit {


    get announcementModels(): Array<Announcement> { return this.viewAnnouncementsService.announcements; }
    get hasLoaded(): boolean { return this.announcementModels != null; }
    get hasFailed(): boolean { return this.viewAnnouncementsService.hasLoadFailed; }

    constructor(private viewAnnouncementsService: ViewAnnouncementsService) { }

    ngOnInit() {
    }
}
