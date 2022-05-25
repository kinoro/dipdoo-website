import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { SharedDataService } from './base/shared-data.service';
import { PostSummary } from '../models/post-summary';
import { Post } from '../models/post';
import { environment } from 'src/environments/environment';
import { TestData } from './base/test-data';
import { PostListOrderBy } from '../enums/post/post-list-order-by';
import { PostListFilterBy } from '../enums/post/post-list-filter-by';
import { Status } from '../models/comms/status';

@Injectable({
  providedIn: 'root'
})
export class PublicStatusDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async get(): Promise<Status> {
        return await this.sharedData.get<Status>(`${this.baseUrl}/public/status`, this.options());
    }
}
