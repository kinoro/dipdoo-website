import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { SharedDataService } from './base/shared-data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicThemeDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async getTodaysTheme(): Promise<string> {
        return await this.sharedData.get<string>(`${this.baseUrl}/public/theme`, this.options(true));
    }
}