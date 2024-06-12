import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { PostListOrderBy } from 'src/app/enums/post/post-list-order-by';
import { RoomType } from 'src/app/enums/post/room-type';
import { ViewPostsService } from 'src/app/services/view-posts.service';
import { Post } from 'src/app/models/post';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';

@Component({
    selector: 'app-view-posts',
    templateUrl: './view-posts.component.html',
    styles: [`
        .hero-body .container .title {
            text-transform: capitalize;
        }
    `]
})
export class ViewPostsComponent implements OnInit, OnDestroy {

    @Input() orderBy: PostListOrderBy;
    @Input() tag: string;

    get posts(): Array<Post> { return this.viewPostsService.posts; }
    get hasLoaded(): boolean { return this.posts != null; }
    get hasFailed(): boolean { return this.viewPostsService.hasLoadFailed; }
    get isMobile(): boolean { return this.appService.isMobile; }
    get isLoggedIn(): boolean { return this.appService.isSignedIn; }
    get isServerUnavailable(): boolean { return this.viewPostsService.isServerUnavailable; }
    get canLoadMore() { return this.viewPostsService.canLoadMore; }

    public isLoadingMore: boolean;
    public orderByEnum: any = PostListOrderBy;
    
    private subscription: Subscription;

    constructor(private viewPostsService: ViewPostsService,
                private appService: AppService,
                private eventService: EventService,) {

        this.subscription = this.eventService.listen().subscribe(eventType => this.handleEvent(eventType));
    }

    ngOnDestroy() {
        if (this.subscription != null) {
            this.subscription.unsubscribe();
        }
    }

    handleEvent(eventType: string) {
        if (eventType.startsWith(EventService.EVENT_POST_DELETED)) {
            var postId = eventType.split('|')[1];
            this.viewPostsService.posts = this.viewPostsService.posts.filter(x => x.id != postId);
        }
    }

    ngOnInit() {
        this.viewPostsService.unload();
        this.viewPostsService.initAsync(this.orderBy, this.tag);
    }

    public switchOrderBy( orderBy: PostListOrderBy) {
        this.appService.navigateTo(`/posts/${this.viewPostsService.getOrderByParam(orderBy)}`);
    }

    async loadMore() {
        this.isLoadingMore = true;

        try {
            await this.viewPostsService.addNextPagePostsAsync();
        } finally {
            this.isLoadingMore = false;
        }
    }
}
