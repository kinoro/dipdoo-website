import { Component, OnInit, Input } from '@angular/core';
import { ViewPostService } from 'src/app/services/view-post.service';
import { Comment } from 'src/app/models/comment';
import { AppService } from 'src/app/services/app.service';

@Component({
    selector: 'app-view-post-comment',
    templateUrl: './view-post-comment.component.html',
    styles: [`
        .reply-button:hover {
            cursor: pointer;
            text-decoration: underline;
        }
    `]
})
export class ViewPostCommentComponent implements OnInit {

    @Input() comment: Comment;
    get canLoadMore() { return this.comment.numSubComments > (this.comment.subComments || []).length; }
    get loadMoreText() { return (this.comment.subComments || []).length == 0 ? "Show replies" : "Show more replies" }

    constructor(private appService: AppService,
                private viewPostService: ViewPostService) { }

    ngOnInit() {
    }


    getTimeSince(comment: Comment) {
        return this.appService.timeSince(comment.commentedAt);
    }

    showReply() {
        this.comment.isReplying = true;
    }

    async loadMoreComments() {
        await this.viewPostService.addNextPageCommentsForCommentAsync(this.comment);
    }

    getProcessedText(commentText: string) {
        return this.appService.linkify(commentText);
    }

    /*
    openUser(comment: CommentSummary) {
        this.appService.navigateTo(`/u/${comment.username}`);
    }

    getCommentText(comment: CommentSummary) {
        return this.appService.linkify(comment.text);
    }
    */
}
