import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { SearchPostsService } from 'src/app/services/search-posts.service';

@Component({
    selector: 'app-search-posts-main-content',
    templateUrl: './search-posts-main-content.component.html',
    styles: []
})
export class SearchPostsMainContentComponent implements OnInit, OnDestroy {

    private static readonly DISTANCE_FROM_BOTTOM_TRIGGER = 200;

    get posts() { return this.searchPostsService.posts; }
    get isLoadingPosts() { return this.searchPostsService.isLoadingPosts; }
    get isEmpty() { return this.searchPostsService.isEmpty; }

    private onScrollFunc: any;
    private scrollTimer: any;

    constructor(private appService: AppService,
        private searchPostsService: SearchPostsService,
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
            const triggerScroll = (document.body.scrollHeight - SearchPostsMainContentComponent.DISTANCE_FROM_BOTTOM_TRIGGER)
            if (currentScroll >= triggerScroll) {
                // you're at the bottom of the page
                await this.searchPostsService.addNextPagePostsAsync();
            }
        }, 200);
    }
}
