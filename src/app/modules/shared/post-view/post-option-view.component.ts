import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { MediaType } from 'src/app/models/media-type';
import { Post, PostOption } from 'src/app/models/post';
import { AppService } from 'src/app/services/app.service';
import { UrlParsingService } from 'src/app/services/url-parsing.service';
import { MediaModalService } from 'src/app/services/media-modal.service';
import { ContentType } from 'src/app/models/content-type';
import { Vote } from 'src/app/models/vote';
import { VoteDataService } from 'src/app/data/vote-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { CheckLoggedInService } from 'src/app/services/check-logged-in.service';
import { ImageHelperService } from 'src/app/services/image-helper-service';
import { HelperService } from 'src/app/services/helper-service';

@Component({
    selector: 'div[app-post-option-view]',
    templateUrl: './post-option-view.component.html',
    styles: [``]
})
export class PostOptionViewComponent {

    @Input() post: Post;
    @Input() option: PostOption;
    @ViewChild('postImage') postImage: ElementRef;

    mediaTypeEnum: any = MediaType;
    isMediaModalActive: boolean;
    hasReported: boolean;

    get isPostVotedOptionVoted() { return this.post.hasUserVoted == true && this.option.hasUserVoted == true; }
    get isPostVotedOptionNotVoted() { return this.post.hasUserVoted == true && this.option.hasUserVoted != true; }
    get isPostNotVoted() { return this.post.hasUserVoted != true; }
    get hasVotedOnPost() { return this.post.hasUserVoted == true; }
    get isDesktop() { return this.appService.isDesktop; }
    get isAdminOrOwner() { return this.appService.isSignedIn && (this.authService.userAccount.isAdmin || this.post.userAccountId == this.authService.userAccount.id); }
    get votesAsPercentage() { return this.helperService.round((this.option.numVotes / this.post.numVotes) * 100, 1); }
    constructor(private appService: AppService,
        private mediaModalService: MediaModalService,
        private urlParsingService: UrlParsingService,
        private voteData: VoteDataService,
        private authService: AuthService,
        private helperService: HelperService,
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
            this.appService.openLink(linkUrl);
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

    onPostImageLoaded(option: PostOption) {
        setTimeout(() => {
            const postImageEl: HTMLImageElement = this.postImage.nativeElement;
            const imageDetails = this.imageHelperService.getImageDetails(postImageEl);
            option.isPortrait = imageDetails.isPortrait;
            option.hasImageLoaded = true;
        }, 1000);

    }
}
