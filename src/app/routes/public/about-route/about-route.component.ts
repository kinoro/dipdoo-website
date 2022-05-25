import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { BaseRoute } from '../../base/base-route';

@Component({
  selector: 'app-about-route',
  templateUrl: './about-route.component.html',
  styles: [`
    p:not(:last-child) {
        margin-bottom: 1rem; 
    }
  `]
})
export class AboutRouteComponent extends BaseRoute implements OnInit {

get siteName() { return this.appService.siteName; }

    constructor(
        appService: AppService) {
        super(appService);
    }

  ngOnInit() {
  }

}
