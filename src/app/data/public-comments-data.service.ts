import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { SharedDataService } from './base/shared-data.service';
import { Comment } from '../models/comment';
import { environment } from 'src/environments/environment';
import { TestData } from './base/test-data';
import { CommentParentType } from '../enums/comment/comment-parent-type';

@Injectable({
  providedIn: 'root'
})
export class PublicCommentsDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async get(parentType: CommentParentType, parentId: string, startFrom: number): Promise<Array<Comment>> {
        if (environment.useTestData) {
            return await TestData.getComments();
        }

        return await this.sharedData.get<Array<Comment>>(`${this.baseUrl}/public/comments/${parentType}/${parentId}/${startFrom}`, this.options());
    }
}