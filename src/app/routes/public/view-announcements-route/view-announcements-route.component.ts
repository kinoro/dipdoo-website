import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { BaseRoute } from '../../base/base-route';
import { ViewAnnouncementsService } from 'src/app/services/view-announcements.service';

@Component({
  selector: 'app-view-announcements-route',
  templateUrl: './view-announcements-route.component.html',
  styles: [``]
})
export class ViewAnnouncementsRouteComponent extends BaseRoute implements OnInit, OnDestroy {

    constructor(
        appService: AppService,
        private viewAnnouncementsService: ViewAnnouncementsService) {
        super(appService);
    }

    setViewOptions() {
        super.setViewOptions();
        this.appService.isFullWidth = true;
    }

    ngOnInit() {
        this.viewAnnouncementsService.unload();
        this.viewAnnouncementsService.refreshAsync();
    }

    ngOnDestroy() {
    }
}
