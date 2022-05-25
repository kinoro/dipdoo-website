import { Component, OnInit } from '@angular/core';
import { BaseRoute } from '../../base/base-route';
import { AppService } from 'src/app/services/app.service';
import { environment } from 'src/environments/environment';
import { PostListOrderBy } from 'src/app/enums/post/post-list-order-by';

@Component({
    selector: 'app-home-route',
    templateUrl: './home-route.component.html',
    styles: []
})
export class HomeRouteComponent extends BaseRoute implements OnInit {

    defaultRoom: string = "";

    constructor(
        appService: AppService) {
        super(appService);
    }

    setViewOptions() {
        super.setViewOptions();
        this.appService.isFullWidth = true;
    }

    ngOnInit() {
    }

}
