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
import { Feedback } from 'src/app/models/feedback';
import { FeedbackDataService } from 'src/app/data/feedback-data.service';
import { FeedbackType } from 'src/app/enums/feedback-type';

@Component({
    selector: 'app-feedback-view',
    templateUrl: './feedback-view.component.html',
    styles: [``]
})
export class FeedbackViewComponent implements OnInit {

    feedback: Feedback;
    isSaving: boolean;
    hasSaved: boolean

    get isDesktop() { return this.appService.isDesktop; }
    get isLoggedIn() { return this.appService.isSignedIn; }

    constructor(private appService: AppService,
        private feedbackData: FeedbackDataService) { }

    ngOnInit() {
        this.feedback = new Feedback();
    }

    showInfoPopup(text: string) {
        this.appService.showModalAsync({
            modalType: ModalType.Prompt,
            title: "Help",
            text: text
        });
    }

    async sendFeedback() {
        try {
            this.isSaving = true;
            if ((this.feedback.text || '').length == 0) { return; }
            if (!this.isLoggedIn) {
                var modalResult = await this.appService.showModalAsync({
                    modalType: ModalType.Button,
                    title: "Login or register",
                    text: "You must be logged in before you can leave feedback.",
                    buttons: [ "Login", "Register" ]
                });

                if (modalResult.modalResultType == ModalResultType.Ok) {
                    var route = modalResult.inputText == "Login" ? "/sign-in" : "/sign-up";
                    this.appService.navigateTo(route);
                }
                return;
            }

            this.feedback.feedbackType = FeedbackType.Other;
            var feedback = await this.feedbackData.save(this.feedback);
            if (feedback.id != "") {
                this.hasSaved = true;
                this.feedback = new Feedback();

                this.appService.showModal({
                    title: "Feedback sent",
                    text: "We are very grateful for the feedback we receive, so thank you very much!",
                    modalType: ModalType.Prompt
                });
            }
        } finally {
            this.isSaving = false;
        }
    }
}
