import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { SharedDataService } from './base/shared-data.service';
import { Observable } from 'rxjs';
import { RoomSummary } from '../models/room-summary';

@Injectable({
  providedIn: 'root'
})
export class PublicRoomsDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async getAllPinned(): Promise<Array<RoomSummary>> {
        return await this.sharedData.get<Array<RoomSummary>>(`${this.baseUrl}/public/rooms/all`, this.options());
    }
}