import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
    selector: 'app-home-header',
    templateUrl: './home-header.component.html',
    styles: [`
        p:not(:last-child) {
            margin-bottom: 1rem;
        }
    `]
})
export class HomeHeaderComponent implements OnInit {

    get siteName() { return this.appService.siteName }

    constructor(private appService: AppService) { }

    ngOnInit() {
    }

    navigateToCreateList() {
        this.appService.navigateTo("/edit-list");
    }
}
