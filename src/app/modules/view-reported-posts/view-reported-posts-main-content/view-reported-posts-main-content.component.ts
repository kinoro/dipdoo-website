import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ViewReportedPostsService } from 'src/app/services/view-reported-posts.service';

@Component({
    selector: 'app-view-reported-posts-main-content',
    templateUrl: './view-reported-posts-main-content.component.html',
    styles: []
})
export class ViewReportedPostsMainContentComponent implements OnInit, OnDestroy {

    private static readonly DISTANCE_FROM_BOTTOM_TRIGGER = 200;

    get posts() { return this.viewReportedPostsService.posts; }
    get isLoadingPosts() { return this.viewReportedPostsService.isLoadingPosts; }

    private onScrollFunc: any;
    private scrollTimer: any;

    constructor(private appService: AppService,
        private viewReportedPostsService: ViewReportedPostsService,
        private renderer: Renderer2) { }

    ngOnInit() {
        this.onScrollFunc = this.renderer.listen(document, 'scroll', (evt) => { this.onScroll(evt); });
    }

    ngOnDestroy() {
        if (this.onScrollFunc) {
            this.onScrollFunc();
        }
    }

    async onScroll(e: Event) {
        if (this.scrollTimer !== null) {
            clearTimeout(this.scrollTimer);
        }
        this.scrollTimer = setTimeout(async () => {
            const currentScroll = (window.innerHeight + window.scrollY);
            const triggerScroll = (document.body.scrollHeight - ViewReportedPostsMainContentComponent.DISTANCE_FROM_BOTTOM_TRIGGER)
            if (currentScroll >= triggerScroll) {
                // you're at the bottom of the page
                await this.viewReportedPostsService.addNextPagePostsAsync();
            }
        }, 200);
    }
}
