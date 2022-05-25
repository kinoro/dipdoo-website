import { Injectable, ViewChild } from '@angular/core';
import { StorageItemDataService } from '../data/storage-item-data.service';
import { CreateStorageItemRequest } from '../models/comms/create-storage-item-request';
import { BrowserUploadData } from '../models/browser-upload-data';
import { formatDate } from '@angular/common';
import { S3DataService } from '../data/s3-data.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { ConfirmStorageItemRequest } from '../models/comms/confirm-storage-item-request';
import { Subject, Observable } from 'rxjs';
import { BrowserUploadSuccess } from '../models/ui/browser-upload-success';

@Injectable({
    providedIn: 'root'
})
export class BrowserUploadService {
    browserUploadEventGuid: string;

    private _state: BrowserUploadState;
    private uploadSuccessEvents: Subject<BrowserUploadSuccess>;

    get state(): BrowserUploadState { return this._state; }
    //set state(state: BrowserUploadState) { this._state = state; this.browserUploadModal.afterStateChange(); }

    constructor(private storageItemData: StorageItemDataService,
        private s3Data: S3DataService) { 

        this.uploadSuccessEvents = new Subject<BrowserUploadSuccess>();
    }

    listenForSuccess(): Observable<BrowserUploadSuccess> {
        return this.uploadSuccessEvents.asObservable();
    }

    async getUploadData(filename: string): Promise<BrowserUploadData> {
        var createStorageItemRequest = new CreateStorageItemRequest();
        createStorageItemRequest.filename = filename;

        return this.storageItemData.create(createStorageItemRequest);
    }

    buildFormData(browserUploadData: BrowserUploadData, filename: string, fileBlob: Blob): FormData {
        var formData = new FormData();

        var amzDate = browserUploadData.amzDate.getUTCFullYear().toString();
        amzDate += this.prependZeroAsString(browserUploadData.amzDate.getUTCMonth() + 1);
        amzDate += this.prependZeroAsString(browserUploadData.amzDate.getUTCDate());
        amzDate += "T";
        amzDate += this.prependZeroAsString(browserUploadData.amzDate.getUTCHours());
        amzDate += this.prependZeroAsString(browserUploadData.amzDate.getUTCMinutes());
        amzDate += this.prependZeroAsString(browserUploadData.amzDate.getUTCSeconds());
        amzDate += "Z";

        var amzCredentialDateMonth = this.prependZeroAsString(browserUploadData.amzCredentialDate.getMonth() + 1);
        var amzCredentialDateDay =  this.prependZeroAsString(browserUploadData.amzCredentialDate.getDate());
        
        var amzCredential = browserUploadData.amzCredentialAccessKeyId;
        amzCredential += "/" + browserUploadData.amzCredentialDate.getFullYear() + amzCredentialDateMonth + amzCredentialDateDay;
        amzCredential += "/" + browserUploadData.amzCredentialRegion;
        amzCredential += "/s3/aws4_request";

        formData.append("key", browserUploadData.key);
        formData.append("bucket", "minymo-images");
        formData.append("acl", browserUploadData.acl);
        formData.append("Content-Type", browserUploadData.contentType);
        formData.append("x-amz-meta-filename", filename);
        formData.append("x-amz-credential", amzCredential);
        formData.append("x-amz-algorithm", browserUploadData.amzAlgorithm);
        formData.append("x-amz-meta-cache-control", "max-age=31536000");
        formData.append("x-amz-date", amzDate);
        formData.append("policy", browserUploadData.policy);
        formData.append("X-Amz-Signature", browserUploadData.amzSignature);
        formData.append("file", fileBlob);

        return formData;
    }

    postToS3(formData: FormData): Promise<string> {
        return this.s3Data.post(formData);
    }

    async confirmStorageItem(id: number): Promise<string> {
        var confirmStorageItemRequest = new ConfirmStorageItemRequest();
        confirmStorageItemRequest.storageItemId = id;

        return this.storageItemData.confirm(confirmStorageItemRequest);
    }

    private prependZeroAsString(num: number): string {
        return (num < 10) ? ("0" + num) : num.toString();
    }
}

export enum BrowserUploadState {
    NotSet,
    ShowFileUpload,
}
