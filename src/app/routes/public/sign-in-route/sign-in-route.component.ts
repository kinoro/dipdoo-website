import { Component, OnInit } from '@angular/core';
import { BaseRoute } from '../../base/base-route';
import { AppService } from 'src/app/services/app.service';

@Component({
    selector: 'app-sign-in-route',
    templateUrl: './sign-in-route.component.html',
    styles: [``]
})
export class SignInRouteComponent extends BaseRoute implements OnInit {

    constructor(
        appService: AppService) {
        super(appService);
    }

    setViewOptions() {
        super.setViewOptions();
        this.appService.isBodyAlignCenter = true;
        this.appService.hasSignUpImage = true;
    }

    ngOnInit() {
    }

}
