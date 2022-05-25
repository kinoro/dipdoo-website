import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { SharedDataService } from './base/shared-data.service';
import { Post } from '../models/post';
import { PostSummary } from '../models/post-summary';
import { UrlMetadata } from '../models/url-metadata';

@Injectable({
  providedIn: 'root'
})
export class UrlMetadataDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async generate(url: string): Promise<UrlMetadata> {
        return await this.sharedData.post<UrlMetadata>(`${this.baseUrl}/private/urlmetadata/generate`, { url }, this.options());
    }
}
