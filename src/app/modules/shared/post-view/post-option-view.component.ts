import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, ElementRef, ViewChild } from '@angular/core';
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
import { CheckLoggedInService } from 'src/app/services/check-logged-in.service';
import { PostsDataService } from 'src/app/data/posts-data.service';
import { ImageHelperService } from 'src/app/services/image-helper-service';

@Component({
    selector: 'div[app-post-option-view]',
    templateUrl: './post-option-view.component.html',
    styles: [`
        .is-not-checked {
            opacity: 0.3;
        }

        .box {
            padding: 1rem 1rem 0.75rem 1rem;
        }

        img.is-portrait {
            height: 95% !important;
            width: auto !important;
            margin: auto;
        }

        img.is-landscape {
            height: auto !important;
            width: 95% !important;
            margin: auto;
        }

        .image-container {
            cursor: pointer;
            text-align: center !important;
            margin: 0 0.5rem 0.5rem 0.5rem;
        }

        .curved-top-border {
            border-top-left-radius: 0.25rem !important;
            border-top-right-radius: 0.25rem !important;
        }

        .curved-bottom-border {
            border-bottom-left-radius: 0.25rem !important;
            border-bottom-right-radius: 0.25rem !important;
        }

        .text-with-image {
            margin-bottom: 2px !important;
        }

        .margin-top {
            margin-top: 0.5rem;
        }
    `]
})
export class PostOptionViewComponent {

    @Input() post: Post;
    @Input() option: PostOption;
    @ViewChild('postImage', { static: false }) postImage: ElementRef;

    mediaTypeEnum: any = MediaType;
    isMediaModalActive: boolean;
    hasReported: boolean;

    get hasVotedOnPost() { return this.post.hasUserVoted == true; }
    get isDesktop() { return this.appService.isDesktop; }
    get isAdminOrOwner() { return this.appService.isSignedIn && (this.authService.userAccount.isAdmin || this.post.userAccountId == this.authService.userAccount.id); }

    constructor(private appService: AppService,
        private mediaModalService: MediaModalService,
        private urlParsingService: UrlParsingService,
        private voteData: VoteDataService,
        private authService: AuthService,
        private checkLoggedInService: CheckLoggedInService,
        private imageHelperService: ImageHelperService,) { }


    getMediaType(url: string): MediaType {
        return this.urlParsingService.getMediaType(url);
    }

    showMedia() {
        let imageUrl = this.option.imageUrl;
        let linkUrl = this.option.linkUrl;
        let contentType = this.option.contentType;
        const mediaType = this.getMediaType(linkUrl);
        if (contentType === ContentType.Link && mediaType === MediaType.Unknown) {
            this.appService.openInNewTab(linkUrl);
            return;
        }

        const url = contentType === ContentType.Image ? imageUrl : linkUrl;
        this.mediaModalService.show(url, contentType, mediaType);
    }

    async vote(postOption: PostOption) {
        if (!(await this.checkLoggedInService.checkLoggedInAndEmailConfirmed(
            "You must be logged in to vote.",
            "You must confirm your email address before you can vote."
        ))) {
            return;
        }

        if (this.post.hasUserVoted != true) {
            this.post.hasUserVoted = true;
            postOption.hasUserVoted = true;
            postOption.numVotes += 1;
            this.post.numVotes += 1;

            let vote = new Vote();
            vote.postId = this.post.id;
            vote.postOptionId = postOption.id;
            try {
                await this.voteData.save(vote);
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

    onPostImageLoaded(option: PostOption) {
        setTimeout(() => {
            const postImageEl: HTMLImageElement = this.postImage.nativeElement;
            const imageDetails = this.imageHelperService.getImageDetails(postImageEl);
            option.isPortrait = imageDetails.isPortrait;
            option.hasImageLoaded = true;
        }, 1000);

    }
}
