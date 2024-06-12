import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PostSummary } from 'src/app/models/post-summary';
import { ViewPostService } from 'src/app/services/view-post.service';
import { AppService } from 'src/app/services/app.service';
import { Comment } from 'src/app/models/comment';
import { SeoSocialShareService } from 'src/app/services/seo-social-share.service';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styles: [`
  `]
})
export class ViewPostComponent implements OnInit {

    @Input() postFriendlyId: string;

    get isMobile(): boolean { return this.appService.isMobile; }
    get post(): Post { return this.viewPostService.post; }
    get comments(): Array<Comment> { return this.viewPostService.comments; }
    get hasLoaded(): boolean { return this.post != null }
    get hasFailed(): boolean { return this.viewPostService.hasLoadFailed; }
    get canLoadMore(): boolean { return this.post.numComments > (this.comments || []).length; }

    isLoadingMoreComments: boolean;

    constructor(private viewPostService: ViewPostService,
                private seoSocialShareService: SeoSocialShareService,
                private appService: AppService) { }

    ngOnInit() {
        this.viewPostService.unload();
        this.viewPostService.loadAllPostAsync(this.postFriendlyId).then(post => {
            this.seoSocialShareService.viewPost(post);
        });
    }

    async loadMoreComments() {
        this.isLoadingMoreComments = true;

        try {
            await this.viewPostService.addNextPageCommentsAsync(this.post.id);
        } finally {
            this.isLoadingMoreComments = false;
        }
    }

    getProcessedText(text: string) {
        return this.appService.linkify(text);
    }

}
