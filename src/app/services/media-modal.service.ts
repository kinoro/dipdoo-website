import { Injectable } from '@angular/core';
import { MediaType } from '../models/media-type';
import { ContentType } from '../models/content-type';
import { UrlParsingService } from './url-parsing.service';

@Injectable({
    providedIn: 'root'
})
export class MediaModalService {

    public isModalActive: boolean;
    private url: string;


    contentType: ContentType;
    mediaType: MediaType;

    get isActive() { return this.isModalActive; }
    get urlForUI() { return this.urlParsingService.getUnsafeUrl(this.url); }

    constructor(private urlParsingService: UrlParsingService) {}

    show(url, contentType, mediaType) {
        this.url = mediaType !== MediaType.Unknown ? this.urlParsingService.getMediaEmbedUrl(url) : url;
        this.contentType = contentType;
        this.mediaType = mediaType;
        this.isModalActive = true;
    }

    hide() {
        setTimeout(() => {
            this.url = '';
            this.isModalActive = false;
        }, 50);
    }
}
