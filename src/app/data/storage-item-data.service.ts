import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { Observable } from 'rxjs';
import { SharedDataService } from './base/shared-data.service';
import { BrowserUploadData } from '../models/browser-upload-data';
import { CreateStorageItemRequest } from '../models/comms/create-storage-item-request';
import { ConfirmStorageItemRequest } from '../models/comms/confirm-storage-item-request';

@Injectable({
  providedIn: 'root'
})
export class StorageItemDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async create(createStorageItemRequest: CreateStorageItemRequest): Promise<BrowserUploadData> {
        return await this.sharedData.post<BrowserUploadData>(`${this.baseUrl}/private/storageitem/create`, createStorageItemRequest, this.options());
    }

    public async confirm(confirmStorageItemRequest: ConfirmStorageItemRequest): Promise<string> {
        return await this.sharedData.post<string>(`${this.baseUrl}/private/storageitem/confirm`, confirmStorageItemRequest, this.options(true));
    }
}
