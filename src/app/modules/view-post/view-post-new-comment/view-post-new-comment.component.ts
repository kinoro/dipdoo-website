import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewPostService } from 'src/app/services/view-post.service';
import { AppService } from 'src/app/services/app.service';
import { CommentDataService } from 'src/app/data/comment-data.service';
import { SaveCommentRequest } from 'src/app/models/comms/save-comment-request';
import { Comment } from 'src/app/models/comment';
import { AuthService } from 'src/app/services/auth.service';
import { LoginRequest } from 'src/app/data/auth-data.service';
import { CommentViewModel, CommentViewModelErrorCodes } from '../comment-view-model';
import { EditCommentService } from 'src/app/services/edit-comment.service';
import { ModalDetails, ModalResultType, ModalType } from 'src/app/models/modal-details';
import { CheckLoggedInService } from 'src/app/services/check-logged-in.service';

@Component({
    selector: 'app-view-post-new-comment',
    templateUrl: './view-post-new-comment.component.html',
    styles: [`
        .space-between {
            justify-content: space-between;
        }

        .space-around {
            justify-content: space-around;
        }
    `]
})
export class ViewPostNewCommentComponent implements OnInit {

    @Input() parentComment: Comment;

    get textMaxLength() { return EditCommentService.textMaxLength; }
    get textMinLength() { return EditCommentService.textMinLength; }

    get isSignedIn() { return this.appService.isSignedIn; }
    get areCommentNotificationsOn() { return this.viewPostService.userPostPreferences.areCommentNotificationsOn; }
    get isMobile() { return this.appService.isMobile; }
    get isAdmin() { return this.authService.isSignedIn && this.authService.userAccount.isAdmin; }
    get textPlaceholder() { return `${this.textMinLength}-${this.textMaxLength} characters`; }

    commentViewModel: CommentViewModel;
    submitted: boolean;
    isUnauthorisedModalActive: boolean;
    isUnconfirmedModalActive: boolean;
    unauthorizedModalText: string;
    hasSavedUserPostPreferences: boolean;
    usernames: Array<string> = [];

    commentViewModelErrorCodesEnum: any = CommentViewModelErrorCodes;

    isSaving = false;

    constructor(private appService: AppService,
        private viewPostService: ViewPostService,
        private editCommentService: EditCommentService,
        private commentData: CommentDataService,
        private authService: AuthService,
        private checkLoggedInService: CheckLoggedInService) { }

    ngOnInit() {
        this.reset();

        if (this.authService.isSignedIn) {
            this.usernames = [
                this.authService.userAccount.username,
                ...(this.authService.userAccount.children || []).map(x => x.username)
            ];
            this.commentViewModel.username = this.authService.userAccount.username;
        }
    }

    reset() {
        this.commentViewModel = new CommentViewModel();
        this.commentViewModel.postId = this.viewPostService.post.id;

        this.submitted = false;
        this.isSaving = false;
    }

    async revalidate() {
        if (this.submitted) {
            await this.editCommentService.validateCommentViewModel(this.commentViewModel, true);
        }
    }

    async trySave() {
        if (!(await this.checkLoggedInService.checkLoggedInAndEmailConfirmed(
            "You must be logged in to add a comment.",
            "You must confirm your email address before you can add a comment."
        ))) {
            return;
        }

        await this.editCommentService.validateCommentViewModel(this.commentViewModel);
        this.submitted = true;
        this.isSaving = true;

        if (!this.commentViewModel.hasErrors) {
            try {
                this.commentViewModel.parentCommentId = this.parentComment == null ? null : this.parentComment.id;
                const comment = await this.editCommentService.convertToComment(this.commentViewModel);
                await this.commentData.save(comment);
                if (this.parentComment == null) {
                    await this.viewPostService.refreshCommentsForPost();
                } else {
                    await this.viewPostService.refreshCommentsForComment(this.parentComment);
                }

                this.trackEvent('add-comment');
                this.reset();
                this.cancel();
            } catch (err) {
                var msg = err.status == 429
                    ? "You're doing that just a little too often. Please try again shortly."
                    : 'Unfortunately we encountered a problem saving the comment. Please try again shortly.'
                this.appService.showModal({
                    title: 'Oh no!',
                    text: msg,
                });
                this.isSaving = false;
            }
        } else {
            this.isSaving = false;
        }
    }

    cancel() {
        if (this.parentComment != null) {
            this.parentComment.isReplying = false;
        }
    }

    cancelHoldAndRegister() { this.isUnauthorisedModalActive = false; }
    cancelRefreshUserAndRetry() { this.isUnconfirmedModalActive = false; }

    trackEvent(eventName: string) {
        try {
            (<any>window).gtag("event", eventName, {});
        } catch { }
    }

    public toggleCommentNotificationsActive() {
        this.hasSavedUserPostPreferences = true;
        this.viewPostService.setCommentNotificationsActive(!this.viewPostService.userPostPreferences.areCommentNotificationsOn);
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

                this.commentViewModel.username = result.inputText
            }
        } catch { }
    }
}
