import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { SharedDataService } from './base/shared-data.service';
import { Feedback } from '../models/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async save(model: Feedback): Promise<Feedback> {
        return await this.sharedData.post<Feedback>(`${this.baseUrl}/private/feedback/`, model, this.options());
    }
}
