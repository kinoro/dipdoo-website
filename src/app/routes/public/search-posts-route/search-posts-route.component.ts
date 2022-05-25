import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseRoute } from '../../base/base-route';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchPostsService } from 'src/app/services/search-posts.service';

@Component({
  selector: 'app-search-posts-route',
  templateUrl: './search-posts-route.component.html',
  styles: [`
  .section {
      /*padding: 1rem 1.5rem;*/
  }
`]
})
export class SearchPostsRouteComponent extends BaseRoute implements OnInit, OnDestroy {
    static readonly PARAM_SEARCH_TERM = "searchTerm";

    get hasLoadedUser() { return this.appService.hasLoadedUser; }

    public paramSearchTerm: string;
    private paramSubscription: Subscription;

    constructor(
        appService: AppService,
        private route: ActivatedRoute,
        private router: Router,
        private searchPostsService: SearchPostsService) {
        super(appService);
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    setViewOptions() {
        super.setViewOptions();
        this.appService.isFullWidth = true;
    }

    ngOnInit() {
        this.paramSubscription = this.route.paramMap.subscribe(params => {
            this.paramSearchTerm = params.get(SearchPostsRouteComponent.PARAM_SEARCH_TERM);

            if (this.appService.hasLoadedUser) {
                this.searchPostsService.unload();
            }
        });
    }

    ngOnDestroy() {
        this.paramSubscription.unsubscribe();
    }
}
