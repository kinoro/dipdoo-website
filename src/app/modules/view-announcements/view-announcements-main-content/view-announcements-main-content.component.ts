import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ViewAnnouncementsService } from 'src/app/services/view-announcements.service';

@Component({
    selector: 'app-view-announcements-main-content',
    templateUrl: './view-announcements-main-content.component.html',
    styles: []
})
export class ViewAnnouncementsMainContentComponent {

    get announcements() { return this.viewAnnouncementsService.announcements; }
    get isLoading() { return this.viewAnnouncementsService.isLoading; }

    constructor(private appService: AppService,
        private viewAnnouncementsService: ViewAnnouncementsService) { }
}
