import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { Observable } from 'rxjs';
import { SharedDataService } from './base/shared-data.service';
import { SaveLikeRequest } from '../models/comms/save-like-request';
import { LikeSummary } from '../models/like-summary';
import { PostTagSummary } from '../models/post-tag-summary';

@Injectable({
  providedIn: 'root'
})
export class PostTagSummaryDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async save(postTagSummary: PostTagSummary): Promise<object> {
        return await this.sharedData.post<PostTagSummary>(`${this.baseUrl}/private/posttagsummary/`, postTagSummary, this.options());
    }

    public async get(postDPId: string): Promise<PostTagSummary> {
        return await this.sharedData.get<PostTagSummary>(`${this.baseUrl}/private/posttagsummary/${postDPId}`, this.options());
    }
}
