import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostListOrderBy } from 'src/app/enums/post/post-list-order-by';
import { AppService } from 'src/app/services/app.service';
import { ViewPostsService } from 'src/app/services/view-posts.service';

@Component({
    selector: 'app-view-posts-topbar',
    templateUrl: './view-posts-topbar.component.html',
    styles: []
})
export class ViewPostsTopbarComponent implements OnInit {

    get posts() { return this.viewPostsService.posts; }
    get hasTag() { return this.viewPostsService.tag != null && this.viewPostsService.tag.length > 0; }
    get tag() { return this.viewPostsService.tag; }
    get isDesktop() { return this.appService.isDesktop; }

    orderByEnum: any = PostListOrderBy;

    constructor(private appService: AppService,
                private viewPostsService: ViewPostsService,) { }

    ngOnInit() {
    }

    removeSelectedTag() {
        var orderBy =  this.viewPostsService.getOrderByParam(this.viewPostsService.orderBy);
        this.appService.navigateTo(`/posts/${orderBy}`);
    }

    getChangeOrderByUrl(selectedOrderBy: PostListOrderBy) {
        var orderBy =  this.viewPostsService.getOrderByParam(selectedOrderBy);
        var tagPart = this.viewPostsService.tag != null && this.viewPostsService.tag.length > 0
            ? `/${this.viewPostsService.tag}`
            : '';
        return `/posts/${orderBy}${tagPart}`;
    }

    isOrderBy(orderBy: PostListOrderBy) {
        return this.viewPostsService.orderBy == orderBy;
    }

}
