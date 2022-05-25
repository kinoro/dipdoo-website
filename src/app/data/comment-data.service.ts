import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { Observable } from 'rxjs';
import { SharedDataService } from './base/shared-data.service';
import { SavePostRequest } from '../models/comms/save-post-request';
import { Comment } from '../models/comment';
import { SaveCommentRequest } from '../models/comms/save-comment-request';

@Injectable({
  providedIn: 'root'
})
export class CommentDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async save(comment: Comment): Promise<Comment> {
        return await this.sharedData.post<Comment>(`${this.baseUrl}/private/comments/`, comment, this.options());
    }
}
