import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseRoute } from '../../base/base-route';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostListOrderBy } from 'src/app/enums/post/post-list-order-by';
import { ViewPostsService } from 'src/app/services/view-posts.service';

@Component({
  selector: 'app-view-posts-route',
  templateUrl: './view-posts-route.component.html',
  styles: [`
  .section {
      /*padding: 1rem 1.5rem;*/
  }
`]
})
export class ViewPostsRouteComponent extends BaseRoute implements OnInit, OnDestroy {
    static readonly PARAM_ORDER_BY = "orderBy";
    static readonly PARAM_TAG = "tag";

    get hasLoadedUser() { return this.appService.hasLoadedUser; }

    public paramOrderBy: string;
    public paramTag: string;
    public orderBy: PostListOrderBy;

    private paramSubscription: Subscription;

    constructor(
        appService: AppService,
        private route: ActivatedRoute,
        private viewPostsService: ViewPostsService) {
        super(appService);
    }

    setViewOptions() {
        super.setViewOptions();
        this.appService.isFullWidth = true;
    }

    ngOnInit() {
        this.paramSubscription = this.route.paramMap.subscribe(params => {
            this.paramOrderBy = params.get(ViewPostsRouteComponent.PARAM_ORDER_BY);
            this.paramTag = params.get(ViewPostsRouteComponent.PARAM_TAG) || "";
            this.orderBy = this.viewPostsService.getOrderBy(this.paramOrderBy);
            if (this.appService.hasLoadedUser) {
                this.viewPostsService.unload();
                this.viewPostsService.initAsync(this.orderBy, this.paramTag);
            }
        });
    }

    ngOnDestroy() {
        this.paramSubscription.unsubscribe();
    }
}
