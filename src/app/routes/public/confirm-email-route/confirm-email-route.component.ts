import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { BaseRoute } from '../../base/base-route';
import { AuthDataService } from 'src/app/data/auth-data.service';

@Component({
    selector: 'app-confirm-email-route',
    templateUrl: './confirm-email-route.component.html',
    styles: []
})
export class ConfirmEmailRouteComponent extends BaseRoute implements OnInit {

    static readonly PARAM_EMAIL = "email";
    static readonly PARAM_EMAIL_CONFIRMATION_TOKEN = "emailConfirmationToken";

    email: string;
    emailConfirmationToken: string;

    constructor(
        appService: AppService,
        private router: Router,
        private route: ActivatedRoute) {
        super(appService);
    }

    setViewOptions() {
        super.setViewOptions();
        this.appService.isBodyAlignCenter = true;
        this.appService.hasSignUpImage = true;
    }

    ngOnInit() {
        var url = this.router.url;
        this.email = this.getQueryParam(ConfirmEmailRouteComponent.PARAM_EMAIL);
        this.emailConfirmationToken = this.getQueryParam(ConfirmEmailRouteComponent.PARAM_EMAIL_CONFIRMATION_TOKEN);
    }

    getQueryParam(name: string): string {
        const results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(decodeURIComponent(this.router.url))
        if (!results) {
            return "";
        }

        return results[1] || "";
    }
}
