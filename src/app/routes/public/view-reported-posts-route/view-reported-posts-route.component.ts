import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute } from '@angular/router';
import { ViewPostService } from 'src/app/services/view-post.service';
import { BaseRoute } from '../../base/base-route';
import { SeoSocialShareService } from 'src/app/services/seo-social-share.service';
import { ViewReportedPostsService } from 'src/app/services/view-reported-posts.service';

@Component({
  selector: 'app-view-reported-posts-route',
  templateUrl: './view-reported-posts-route.component.html',
  styles: [``]
})
export class ViewReportedPostsRouteComponent extends BaseRoute implements OnInit, OnDestroy {

    constructor(
        appService: AppService,
        private viewReportedPostsService: ViewReportedPostsService) {
        super(appService);
    }

    setViewOptions() {
        super.setViewOptions();
        this.appService.isFullWidth = true;
    }

    ngOnInit() {
        this.viewReportedPostsService.unload();
        this.viewReportedPostsService.loadAsync();
    }

    ngOnDestroy() {
    }
}
