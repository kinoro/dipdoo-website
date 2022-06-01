import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostListOrderBy } from 'src/app/enums/post/post-list-order-by';
import { ModalResultType, ModalType } from 'src/app/models/modal-details';
import { SiteConfig } from 'src/app/models/site-config';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { SiteConfigService } from 'src/app/services/site-config.service';
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
                private authService: AuthService,
                private siteConfigService: SiteConfigService,
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

    async goToNewPost() {
        if (!this.authService.isSignedIn) {
            var modalResult = await this.appService.showModalAsync({
                modalType: ModalType.Button,
                title: "Login or register",
                text: "You must be logged in before you can create a new post.",
                buttons: [ "Login", "Register" ]
            });

            if (modalResult.modalResultType == ModalResultType.Ok) {
                var route = modalResult.inputText == "Login" ? "/sign-in" : "/sign-up";
                this.appService.navigateTo(route);
            }
            
            return false;
        }
        var siteConfig = await this.siteConfigService.get();
        if (this.authService.userAccount.numVotes < siteConfig.minAnswersBeforePosting) {
            var numVotesRemaining = siteConfig.minAnswersBeforePosting - this.authService.userAccount.numVotes;
            var postText = numVotesRemaining == 1 ? "post" : "posts";
            var modalResult = await this.appService.showModalAsync({
                modalType: ModalType.Prompt,
                title: "Before you post",
                text: `Please vote on at least ${numVotesRemaining} other ${postText} first.`
            });
            
            return false;
        }

        this.appService.navigateTo('/edit-post');
    }

}
