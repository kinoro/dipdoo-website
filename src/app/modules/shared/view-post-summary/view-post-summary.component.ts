import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { PostSummary } from 'src/app/models/post-summary';
import { AuthService } from 'src/app/services/auth.service';
import { PostsDataService } from 'src/app/data/posts-data.service';
import { ModalType, ModalResultType } from 'src/app/models/modal-details';
import { BlockedUserService } from 'src/app/services/blocked-user.service';
import { ImageHelperService } from 'src/app/services/image-helper-service';
import { DrawMode } from 'src/app/enums/canvas/draw-mode';
import { AnimationMode } from 'src/app/enums/canvas/animation-mode';
import { RoomSummary } from 'src/app/models/room-summary';
import { ViewPostsService } from 'src/app/services/view-posts.service';

@Component({
    selector: 'app-view-post-summary',
    templateUrl: './view-post-summary.component.html',
    styles: [`
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
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
            /*background-color: whitesmoke;*/
        }

        .view-content {
            margin-bottom: 0;
        }

        .box {
            padding: 1rem 1rem 0.75rem 1rem;
        }

        .box-mobile-margin {
            margin-bottom: 0.5rem;
        }

        .box-desktop-margin {
            margin-bottom: 0.5rem;
            margin-left: 0.25rem;
            margin-right: 0.25rem;
        }
    `]
})
export class ViewPostSummaryComponent implements OnInit, OnDestroy {

    @Input() post: PostSummary;
    @ViewChild('linkUrlInput', { static: false }) public linkUrlInput: ElementRef;
    @ViewChild('postImage', { static: false }) postImage: ElementRef;

    drawMode: DrawMode;
    animationMode: AnimationMode;
    drawModeEnum: any = DrawMode;
    animationModeEnum: any = AnimationMode;
    selectedRoom: string;
    isRoomPickerActive = false;

    public isPlayMedia: boolean;
    public isShowingShare: boolean;
    public isLinkCopied: boolean;
    public linkUrl: string;
    public isDeleting: boolean;
    public isStandardLandscape: boolean;
    public isStandardPortrait: boolean;
    public isStandardSquare: boolean;
    public isPortrait: boolean;
    public hasImageLoaded: boolean;
    public isRegisterModalActive: boolean;

    get imageUrl() { return this.post.url; }
    get username() { return this.post.username; }
    get timeSince() { return this.appService.timeSince(this.post.createdAt); }
    get numComments() { return this.post.numComments; }
    get numLikes() { return this.post.numLikes; }
    get canDelete() { return this.authService.userAccount != null && (this.authService.userAccount.isAdmin || this.post.username == this.appService.username); }
    get isAdmin() { return this.authService.userAccount != null && this.authService.userAccount.isAdmin; }
    get doesLikePost() { return false }
    get isUserBlocked() { return this.blockedUserService.hasBlockedUser(this.username); }
    get isStandardResolution() { return this.isStandardPortrait || this.isStandardLandscape || this.isStandardSquare; }
    get canUseAsBase() { return !this.isUserBlocked && !this.isAnimation && this.hasImageLoaded && this.isStandardResolution; }
    get isAnimation() { return this.post.title.endsWith('.gif'); }
    get pinnedRooms(): RoomSummary[] { return this.viewPostsService.pinnedRooms.filter(x => x.name !== 'general'); }
    get isDesktop(): boolean { return this.appService.isDesktop; }

    constructor(private appService: AppService,
                private authService: AuthService,
                private postData: PostsDataService,
                private viewPostsService: ViewPostsService,
                private blockedUserService: BlockedUserService,
                private imageHelperService: ImageHelperService,
        ) { }

    ngOnInit() {
        this.linkUrl = `${window.location.href.split('/r/')[0]}/s/${this.post.room}/${this.post.dpId}`;
        this.drawMode = DrawMode.Simple;
        this.animationMode = AnimationMode.NoAnimation;
    }

    ngOnDestroy() {
    }

    viewPost() {
        this.appService.navigateTo(`/s/${this.post.room}/${this.post.dpId}`);
    }

    showShare() {
        this.isLinkCopied = false;
        this.isShowingShare = true;
    }

    cancelShare() {
        this.isShowingShare = false;
    }

    copyLink() {
        const linkUrlEl: HTMLInputElement = this.linkUrlInput.nativeElement;
        linkUrlEl.select();
        document.execCommand('copy');
        this.isLinkCopied = true;
    }

    toggleLike() {
    }

    cancelRegisterModal() {
        this.isRegisterModalActive = false;
    }

    chooseDrawMode(drawMode: DrawMode) { this.drawMode = drawMode; }
    chooseAnimationMode(animationMode: AnimationMode) { this.animationMode = animationMode; }

    async delete() {
        const modalResult = await this.appService.showModalAsync({
            title: 'Delete post',
            text: 'Are you sure?',
            modalType: ModalType.Question,
        });

        if (modalResult.modalResultType === ModalResultType.Cancel) {
            return;
        }

        this.isDeleting = true;

        try {
            await this.postData.delete(this.post.dpId);
            this.isDeleting = false;
            await this.viewPostsService.refreshPostsAsync();
        } catch {
            this.isDeleting = false;
            this.appService.showModal({
                title: 'Failed to delete',
                text: 'I\'m guessing you want to know why. Me too.'
            });
        }
    }

    onPostImageLoaded() {
        const postImageEl: HTMLImageElement = this.postImage.nativeElement;
        const imageDetails = this.imageHelperService.getImageDetails(postImageEl);
        this.isStandardLandscape = imageDetails.isStandardLandscape;
        this.isStandardPortrait = imageDetails.isStandardPortrait;
        this.isStandardSquare = imageDetails.isStandardSquare;
        this.isPortrait = imageDetails.isPortrait;

        this.hasImageLoaded = true;
    }

    openUser() {
        this.appService.navigateTo(`/u/${this.post.username}`);
    }

    public toggleRoomPicker() { this.isRoomPickerActive = !this.isRoomPickerActive; }

    public changeRoom(roomName: string) {
        this.selectedRoom = roomName;
        this.isRoomPickerActive = false;
    }
}
