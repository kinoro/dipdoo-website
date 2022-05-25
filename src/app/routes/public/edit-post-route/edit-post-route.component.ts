import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BaseRoute } from '../../base/base-route';

@Component({
  selector: 'app-edit-post-route',
  templateUrl: './edit-post-route.component.html',
  styles: [``]
})
export class EditPostRouteComponent extends BaseRoute implements OnInit {

    static readonly PARAM_ROOM = "room";

    get hasLoadedUser() { 
        return this.appService.hasLoadedUser === true; 
    }

    public paramRoom: string = '';

    constructor(
        appService: AppService,
        private route: ActivatedRoute) {
        super(appService);
    }

    setViewOptions() {
        super.setViewOptions();
        this.appService.isFullWidth = true;
    }

    ngOnInit() {
       this.paramRoom = this.route.snapshot.paramMap.get(EditPostRouteComponent.PARAM_ROOM);
    }

}
