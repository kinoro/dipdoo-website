import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute } from '@angular/router';
import { ViewPostService } from 'src/app/services/view-post.service';
import { BaseRoute } from '../../base/base-route';
import { SeoSocialShareService } from 'src/app/services/seo-social-share.service';

@Component({
  selector: 'app-view-post-route',
  templateUrl: './view-post-route.component.html',
  styles: [``]
})
export class ViewPostRouteComponent extends BaseRoute implements OnInit, OnDestroy {
    static readonly PARAM_POST_FRIENDLY_ID = "postFriendlyId";

    get hasLoadedUser() { return this.appService.hasLoadedUser; }

    public paramPostFriendlyId: string;

    private paramSubscription: Subscription;

    constructor(
        appService: AppService,
        private route: ActivatedRoute,
        private viewPostService: ViewPostService,
        private seoSocialShareService: SeoSocialShareService) {
        super(appService);
    }

    setSeoMetaData() {
        // overrides default behaviour and we will handle this in the component
    }

    setViewOptions() {
        super.setViewOptions();
        this.appService.isFullWidth = true;
    }

    ngOnInit() {
        this.paramSubscription = this.route.paramMap.subscribe(params => {
            this.paramPostFriendlyId = params.get(ViewPostRouteComponent.PARAM_POST_FRIENDLY_ID);
        });
    }

    ngOnDestroy() {
        this.paramSubscription.unsubscribe();
    }
}
