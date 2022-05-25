import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseRoute } from '../../base/base-route';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ViewUserService } from 'src/app/services/view-user.service';

@Component({
  selector: 'app-view-user-route',
  templateUrl: './view-user-route.component.html',
  styles: [`
  .section {
      padding: 1rem 1.5rem;
  }
`]
})
export class ViewUserRouteComponent extends BaseRoute implements OnInit, OnDestroy {
    static readonly PARAM_USERNAME = 'username';
    static readonly PARAM_USERTABTYPE = 'usertab';

    get hasLoadedUser() { return this.appService.hasLoadedUser; }

    public paramUsername: string;
    public paramUserTabType: string;

    private paramSubscription: Subscription;

    constructor(
        appService: AppService,
        private route: ActivatedRoute,
        private router: Router,
        private viewUserService: ViewUserService) {
        super(appService);
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    setViewOptions() {
        super.setViewOptions();
        this.appService.isFullWidth = true;
    }

    ngOnInit() {
        this.paramSubscription = this.route.paramMap.subscribe(params => {
            this.paramUsername = params.get(ViewUserRouteComponent.PARAM_USERNAME);
            this.paramUserTabType = params.get(ViewUserRouteComponent.PARAM_USERTABTYPE);
        });
    }

    ngOnDestroy() {
        this.paramSubscription.unsubscribe();
    }
}
