import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { SharedDataService } from './base/shared-data.service';
import { SiteConfig } from '../models/site-config';

@Injectable({
  providedIn: 'root'
})
export class SiteConfigDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async get(): Promise<SiteConfig> {
        return await this.sharedData.get<SiteConfig>(`${this.baseUrl}/public/siteConfig`, this.options());
    }
}
