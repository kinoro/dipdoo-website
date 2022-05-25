import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { PostSummary } from 'src/app/models/post-summary';
import { PostListOrderBy } from 'src/app/enums/post/post-list-order-by';
import { ViewReportedPostsService } from 'src/app/services/view-reported-posts.service';

@Component({
    selector: 'app-view-reported-posts',
    templateUrl: './view-reported-posts.component.html',
    styles: [`
        .hero-body .container .title {
            text-transform: capitalize;
        }
    `]
})
export class ViewReportedPostsComponent implements OnInit {


    get postModels(): Array<PostSummary> { return this.viewReportedPostsService.posts; }
    get hasLoaded(): boolean { return this.postModels != null; }
    get hasFailed(): boolean { return this.viewReportedPostsService.hasLoadFailed; }
    public orderByEnum: any = PostListOrderBy;

    constructor(private viewReportedPostsService: ViewReportedPostsService,
        private appService: AppService) { }

    ngOnInit() {
        // this.viewRoomService.unload();
        // this.viewRoomService.loadRoomAsync(this.room);
    }
}
