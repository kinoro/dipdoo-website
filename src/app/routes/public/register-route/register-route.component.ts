import { Component, OnInit } from '@angular/core';
import { BaseRoute } from '../../base/base-route';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-register-route',
    templateUrl: './register-route.component.html',
    styles: [``]
})
export class RegisterRouteComponent extends BaseRoute implements OnInit {

    constructor(
        appService: AppService,
        private route: ActivatedRoute) {
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
