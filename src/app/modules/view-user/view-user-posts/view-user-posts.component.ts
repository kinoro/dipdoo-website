import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ViewUserService } from 'src/app/services/view-user.service';

@Component({
    selector: 'app-view-user-posts',
    templateUrl: './view-user-posts.component.html',
    styles: []
})
export class ViewUserPostsComponent implements OnInit, OnDestroy {

    private static readonly DISTANCE_FROM_BOTTOM_TRIGGER = 200;

    get posts() { return this.viewUserService.posts || []; }
    get isLoadingPosts() { return this.viewUserService.isLoadingPosts; }

    private onScrollFunc: any;
    private scrollTimer: any;

    constructor(private appService: AppService,
                private viewUserService: ViewUserService,
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
            const triggerScroll = (document.body.scrollHeight - ViewUserPostsComponent.DISTANCE_FROM_BOTTOM_TRIGGER);
            if (currentScroll >= triggerScroll) {
                // you're at the bottom of the page
                await this.viewUserService.addNextPagePostsAsync();
            }
        }, 200);
    }
}
