import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { Observable } from 'rxjs';
import { SharedDataService } from './base/shared-data.service';
import { PostReport } from '../models/post-report';

@Injectable({
  providedIn: 'root'
})
export class PostReportDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async save(postReport: PostReport): Promise<PostReport> {
        return await this.sharedData.post<PostReport>(`${this.baseUrl}/private/postreports/`, postReport, this.options());
    }
}
