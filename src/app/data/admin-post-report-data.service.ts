import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { Observable } from 'rxjs';
import { SharedDataService } from './base/shared-data.service';
import { ReportedPostSummary } from '../models/reported-post-summary copy';

@Injectable({
  providedIn: 'root'
})
export class AdminPostReportDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async get(startFrom: number): Promise<Array<ReportedPostSummary>> {
        return await this.sharedData.get<Array<ReportedPostSummary>>(`${this.baseUrl}/admin/postreport/${startFrom}`, this.options());
    }

    public async block(postDPId: string): Promise<object> {
        return await this.sharedData.get<object>(`${this.baseUrl}/admin/postreport/block/${postDPId}`, this.options());
    }

    public async unreport(postDPId: string): Promise<object> {
        return await this.sharedData.get<object>(`${this.baseUrl}/admin/postreport/unreport/${postDPId}`, this.options());
    }
}
