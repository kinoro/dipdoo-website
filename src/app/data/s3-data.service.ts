import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { Observable } from 'rxjs';
import { SharedDataService } from './base/shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class S3DataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async post(formData: FormData): Promise<string> {
        return await this.sharedData.post<string>(this.awsUrl, formData, null);
    }
}
