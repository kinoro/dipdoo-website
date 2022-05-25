import { ViewModel } from 'src/app/models/view-model';

export class CommentViewModel extends ViewModel {
    text: string;
    parentCommentId: string;
    postId: string;
    username: string;
}

export enum CommentViewModelErrorCodes {
    TextMustBeCertainLength,
    TextInvalidCharacters,
}
