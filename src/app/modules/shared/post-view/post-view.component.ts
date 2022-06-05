import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { MediaType } from 'src/app/models/media-type';
import { Post, PostOption } from 'src/app/models/post';
import { AppService } from 'src/app/services/app.service';
import { SearchPostsService } from 'src/app/services/search-posts.service';
import { TagService, TagValidity } from 'src/app/services/tag.service';
import { UrlParsingService } from 'src/app/services/url-parsing.service';
import { MediaModalService } from 'src/app/services/media-modal.service';
import { ContentType } from 'src/app/models/content-type';
import { ViewPostsService } from 'src/app/services/view-posts.service';
import { Vote } from 'src/app/models/vote';
import { VoteDataService } from 'src/app/data/vote-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { ModalResultType, ModalType } from 'src/app/models/modal-details';
import { CheckLoggedInService } from 'src/app/services/check-logged-in.service';
import { PostReportDataService } from 'src/app/data/post-report-data.service';
import { HelperService } from 'src/app/services/helper-service';
import { PostsDataService } from 'src/app/data/posts-data.service';
import { EventService } from 'src/app/services/event.service';
import { PostHelperService } from 'src/app/services/post-helper.service';

@Component({
    selector: 'app-post-view',
    templateUrl: './post-view.component.html',
    styles: [``]
})
export class PostViewComponent implements OnInit {

    @Input() post: Post;
    @Input() allowLinkToPost = true;

    optionFillerArray: Array<number> = [1, 2, 3, 4, 5, 6];
    mediaTypeEnum: any = MediaType;
    isMediaModalActive: boolean;
    isReportModalActive: boolean;
    hasReported: boolean;
    hasStartedDeleting: boolean;
    hasDeleted: boolean;

    get optionFillers() { return this.isDesktop ? this.optionFillerArray.filter(x => x > this.post.options.length) : []; }
    get tagsArray() { return this.post.tags == null ? [] : this.post.tags; }
    get postLink() { return `/post/${this.helperService.buildFriendlyId(this.post)}`; }
    get hasVotedOnPost() { return this.post.hasUserVoted == true; }
    get isDesktop() { return this.appService.isDesktop; }
    get countOptions() { return this.post.options.length; }
    get isAdminOrOwner() { return this.appService.isSignedIn && (this.authService.userAccount.isAdmin || this.post.userAccountId == this.authService.userAccount.id); }
    get imageUrl() { return this.postHelperService.getImageUrlOrDefault(this.post); }
    get isDefaultImageUrl() { return this.imageUrl == this.postHelperService.getDefaultImageUrl(); }

    constructor(private appService: AppService,
        private postHelperService: PostHelperService,
        private mediaModalService: MediaModalService,
        private urlParsingService: UrlParsingService,
        private viewPostsService: ViewPostsService,
        private voteData: VoteDataService,
        private authService: AuthService,
        private checkLoggedInService: CheckLoggedInService,
        private postReportData: PostReportDataService,
        private helperService: HelperService,
        private postsData: PostsDataService,
        private eventService: EventService,) { }

    ngOnInit() {

    }

    getMediaType(url: string): MediaType {
        return this.urlParsingService.getMediaType(url);
    }

    showMediaForPost() {
        this.showMedia(this.post.imageUrl, this.post.linkUrl, this.post.contentType);
    }

    showMediaForOption(postOption: PostOption) {
        this.showMedia(postOption.imageUrl, postOption.linkUrl, postOption.contentType);
    }

    showMedia(imageUrl: string, linkUrl: string, contentType: ContentType) {
        const mediaType = this.getMediaType(linkUrl);
        if (contentType === ContentType.Link && mediaType === MediaType.Unknown) {
            this.appService.openLink(linkUrl);
            return;
        }

        const url = contentType === ContentType.Image ? imageUrl : linkUrl;
        if (url != null && url != this.postHelperService.getDefaultImageUrl())
        {
            this.mediaModalService.show(url, contentType, mediaType);
        }
    }

    getNumVotesText(count: number) { return count == 1 ? `${count} vote` : `${count} votes`; }
    getNumCommentsText(count: number) { return count == 1 ? `${count} comment` : `${count} comments`; }

    selectTag(tag: string) {
        var orderBy = this.viewPostsService.getOrderByParam(this.viewPostsService.orderBy);
        this.appService.navigateTo(`/posts/${orderBy}/${tag}`);
    }

    async vote(postOption: PostOption) {
        if (!(await this.checkLoggedInService.checkLoggedInAndEmailConfirmed(
            "You must be logged in to vote.",
            "You must confirm your email address before you can vote."
        ))) {
            return;
        }

        if (this.post.hasUserVoted != true) {

            let vote = new Vote();
            vote.postId = this.post.id;
            vote.postOptionId = postOption.id;
            try {
                var response = await this.voteData.save(vote);
                if (response.isSuccess) {
                    this.post.hasUserVoted = true;
                    postOption.hasUserVoted = true;
                    postOption.numVotes = response.numPostOptionVotes;
                    this.post.numVotes = response.numPostVotes;
                    this.authService.userAccount.numVotes = response.numUserAccountVotes;
                }
            } catch (err) {
                var msg = err.status == 429
                    ? "You're doing that just a little too often. Please try again shortly."
                    : 'Unfortunately we encountered a problem with your vote. Please try again shortly.'
                this.appService.showModal({
                    title: 'Oh no!',
                    text: msg,
                });
            }
        }
    }

    async delete() {
        this.hasDeleted = true;
        this.postsData.delete(this.post.id);
        this.eventService.raiseEvent(EventService.EVENT_POST_DELETED + this.post.id);
    }

    async showReportModal() {
        if (!(await this.checkLoggedInService.checkLoggedInAndEmailConfirmed(
            "You must be logged in to report a post.",
            "You must confirm your email address before you can report a post."
        ))) {
            return;
        }

        this.isReportModalActive = true;
    }
    cancelReportModal() { this.isReportModalActive = false; }

    async confirmReportModal() {
        this.hasReported = true;
        await this.postReportData.save({
            postId: this.post.id
        });
        this.cancelReportModal();
    }

    navigateTo(path: string) {
        this.appService.navigateTo(path)
    }

    onPostImageLoaded(option: PostOption) {
        /*
        const postImageEl: HTMLImageElement = this.postImage.nativeElement;
        const imageDetails = this.imageHelperService.getImageDetails(postImageEl);
        this.isStandardLandscape = imageDetails.isStandardLandscape;
        this.isStandardPortrait = imageDetails.isStandardPortrait;
        this.isStandardSquare = imageDetails.isStandardSquare;
        this.isPortrait = imageDetails.isPortrait;

        this.hasImageLoaded = true;
        */
    }
}
