import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { UrlParsingService } from './url-parsing.service';
import { ContentType } from '../models/content-type';
import { FeedbackChoice, FeedbackChoiceErrorCodes } from '../modules/edit-post/view-models/feedback-choice';
import { Post, PostOption } from '../models/post';
import { Comment } from '../models/comment';
import { MediaType } from '../models/media-type';
import { UrlMetadataDataService } from '../data/url-metadata-data.service';
import { CommentViewModel, CommentViewModelErrorCodes } from '../modules/view-post/comment-view-model';

@Injectable({
    providedIn: 'root'
})
export class EditCommentService {

    static readonly textMaxLength: number = 2048;
    static readonly textMinLength: number = 1;

    constructor(private appService: AppService) {
    }

    async validateCommentViewModel(commentView: CommentViewModel, isRevalidate: boolean = false): Promise<boolean> {
        commentView.errorCodes = [];

        if (commentView.text == null || commentView.text.length < EditCommentService.textMinLength ||
            commentView.text.length > EditCommentService.textMaxLength) {
            commentView.errorCodes.push(CommentViewModelErrorCodes.TextMustBeCertainLength as number);
        }

        /*
        const validCharactersRegex = /^[a-zA-Z0-9,\-+? ]+$/i;
        if (!validCharactersRegex.test(commentView.text)) {
            commentView.errorCodes.push(CommentViewModelErrorCodes.TextInvalidCharacters as number);
        }
        */

        commentView.hasSubmitted = true;
        return !commentView.hasErrors;
    }


    async convertToComment(commentViewModel: CommentViewModel): Promise<Comment> {
        const comment = new Comment();
        comment.text = commentViewModel.text;
        comment.parentCommentId = commentViewModel.parentCommentId;
        comment.postId = commentViewModel.postId;
        comment.username = commentViewModel.username;

        return comment;
    }
}