import { Component, OnInit, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { PostsDataService } from 'src/app/data/posts-data.service';
import { ContentType } from 'src/app/models/content-type';
import { ModalResultType, ModalType } from 'src/app/models/modal-details';
import { Post } from 'src/app/models/post';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { CheckLoggedInService } from 'src/app/services/check-logged-in.service';
import { EditPostService } from 'src/app/services/edit-post.service';
import { TagService, TagValidity } from 'src/app/services/tag.service';
import { UrlParsingService } from 'src/app/services/url-parsing.service';
import { BasicDetails, BasicDetailsErrorCodes } from './view-models/basic-details';
import { Content } from './view-models/content';
import { FeedbackChoice, FeedbackChoiceErrorCodes } from './view-models/feedback-choice';

@Component({
    selector: 'app-edit-post',
    templateUrl: './edit-post.component.html',
    styles: [`
    .hero-body .container .title {
        text-transform: capitalize;
    }

    li.is-active {
        background-color: #dce0e6;
    }

    .tab {
        padding: 0.5rem 1rem 0.5rem 1rem;
        cursor: pointer;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently */
    }

    .tab-label {
        margin-left: 0.5rem;
    }

    .is-active {
        background-color: white;
        color: black;
    }
  `]
})
export class EditPostComponent implements OnInit {

    @Input() room: string;
    @ViewChild("fileInput") fileInputRef: ElementRef;

    public readonly MAX_IMAGE_SIZE_KB = 750;

    get post(): Post { return null; }
    get hasLoaded(): boolean { return true; }
    get isMobile(): boolean { return this.appService.isMobile; }
    get isViewPortrait(): boolean { return this.appService.isViewPortrait; }
    get canDeleteChoice() { return this.feedbackChoices.length > 2; }
    get canAddChoice() { return this.feedbackChoices.length < 6; }
    get isAdmin() { return this.authService.userAccount == null ? false : this.authService.userAccount.isAdmin; }

    public basicDetails: BasicDetails;
    public feedbackChoices: Array<FeedbackChoice>;
    public submitted: boolean;
    public isSaving: boolean;
    public hasSaveFailed: boolean;
    public hasSaveFailedSpecific: boolean;
    public hasSaveFailed429: boolean;
    public usernames: Array<string> = [];

    public contentTypeEnum: any = ContentType;
    public basicDetailsErrorCodesEnum: any = BasicDetailsErrorCodes;
    public feedbackChoiceErrorCodesEnum: any = FeedbackChoiceErrorCodes;

    private uploadingForContent: Content;

    constructor(private appService: AppService,
        private authService: AuthService,
        private postData: PostsDataService,
        private editPostService: EditPostService,
        private urlParsingService: UrlParsingService,
        private checkLoggedInService: CheckLoggedInService,
        private tagService: TagService) { }

    ngOnInit() {
        this.basicDetails = new BasicDetails();
        this.basicDetails.feedbackContentType = ContentType.TextOnly;
        this.basicDetails.publishDate = (new Date()).toISOString();
        this.basicDetails.username = (this.authService.userAccount || { "username": "" }).username;
        this.feedbackChoices = [new FeedbackChoice(), new FeedbackChoice()];

        if (this.authService.isSignedIn) {
            this.usernames = [
                this.authService.userAccount.username,
                ...(this.authService.userAccount.children || []).map(x => x.username)
            ];
        }
    }

    goHome() {
        this.appService.navigateTo('/home');
    }

    changeContentType(content: Content, contentType: ContentType) {
        content.contentType = contentType;
    }

    changeFeedbackContentType(contentType: ContentType) {
        this.basicDetails.feedbackContentType = contentType;
        for (const feedbackChoice of this.feedbackChoices) {
            feedbackChoice.contentType = contentType;
        }
    }

    async revalidate() {
        if (this.submitted) {
            await this.editPostService.validateBasicDetails(this.basicDetails, true);
            for (let feedbackChoice of this.feedbackChoices) {
                await this.editPostService.validateFeedbackChoice(feedbackChoice, true);
            }
        }
    }

    async trySave() {
        this.hasSaveFailed = false;
        this.hasSaveFailedSpecific = false;
        this.hasSaveFailed429 = false;

        if (!(await this.checkLoggedInService.checkLoggedInAndEmailConfirmed(
            "You must be logged in to submit a new post.",
            "You must confirm your email address before you can submit."
        ))) {
            return;
        }

        await this.editPostService.validateBasicDetails(this.basicDetails);
        for (let feedbackChoice of this.feedbackChoices) {
            await this.editPostService.validateFeedbackChoice(feedbackChoice);
        }
        this.submitted = true;

        if (!this.basicDetails.hasErrors && this.feedbackChoices.filter(x => x.hasErrors).length == 0) {
            try {
                this.isSaving = true;
                const post = await this.editPostService.convertToPost(this.basicDetails, this.feedbackChoices);
                await this.postData.save(post);
                this.goHome();
            } catch (err) {
                this.isSaving = false;
                this.hasSaveFailed429 = err.status == 429;
                this.hasSaveFailedSpecific = this.hasSaveFailed429;
                this.hasSaveFailed = true;
            }

        }
    }

    deleteChoice(feedbackChoice: FeedbackChoice) {
        this.feedbackChoices = this.feedbackChoices.filter(x => x != feedbackChoice);
    }

    addChoice() {
        const index = this.feedbackChoices.length;
        let newChoice = new FeedbackChoice();
        newChoice.contentType = this.feedbackChoices[0].contentType;
        this.feedbackChoices.splice(index, 0, newChoice);
        window.scrollTo(0,document.body.scrollHeight);
    }

    fillTestData() {
        this.basicDetails.title = "test " + this.appService.newGuid();
        this.basicDetails.details = "some details";
        this.basicDetails.tags = "tag1,tag2";
        this.feedbackChoices[0].text = "yes";
        this.feedbackChoices[1].text = "no";
    }

    uploadImage(content: Content) {
        const fileInput = (this.fileInputRef.nativeElement as HTMLInputElement);
        this.uploadingForContent = content;
        this.uploadingForContent.isImageTooBig = false;
        fileInput.value = '';
        fileInput.click();
    }

    onKeyDownTags(evt: KeyboardEvent) {
        if (this.tagService.getTagsValidity(evt.key) !== TagValidity.Valid) {
            evt.preventDefault();
            return false;
        }

        this.revalidate();

        return true;
    }

    onFileUploadChanged() {
        // Check a file was selected
        const fileInput = (this.fileInputRef.nativeElement as HTMLInputElement);
        if (fileInput.files.length == 0) { return; }

        // Check its not too big!
        const file = fileInput.files[0];
        const fileKilobytes = file.size / 1000;
        if (fileKilobytes > this.MAX_IMAGE_SIZE_KB) {
            this.uploadingForContent.isImageTooBig = true;
            return;
        }

        // Set 
        this.uploadingForContent.image = file;
        this.uploadingForContent.imageUrl = URL.createObjectURL(file);
        this.uploadingForContent.safeResourceUrl = this.urlParsingService.getUnsafeUrl(this.uploadingForContent.imageUrl);
        this.uploadingForContent.imageExt = file.name.split('.').pop();
        this.uploadingForContent.imageHostedUrl = null;
    }

    async addChildUser() {
        try {
            var result = await this.appService.showModalAsync({
                modalType: ModalType.Input,
                title: "New user",
                text: "Enter a username"
            });

            if (result.modalResultType == ModalResultType.Ok && result.inputText != null && result.inputText.length > 0) {
                this.usernames = [
                    ...this.usernames,
                    result.inputText
                ];

                this.basicDetails.username = result.inputText
            }
        } catch { }
    }

    usernameChanged() {

    }
}
