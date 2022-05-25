import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaType } from '../models/media-type';

@Injectable({
    providedIn: 'root'
})
export class UrlParsingService {

    constructor(private sanitizer: DomSanitizer) { }

    sanitizeUrl(url: string): string {
        if (url == null) { return url; }
        if (!url.toLocaleLowerCase().startsWith('http://') && !url.toLocaleLowerCase().startsWith('https://')) {
            return `https://${url}`;
        }

        return url;
    }

    isLinkValid(url: string): boolean {
        let regexValidUrl = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
        return regexValidUrl.test(url);
    }

    isLinkUnbroken(url: string): Promise<boolean> {
        return Promise.resolve(true);

        return new Promise<boolean>((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.timeout = 500;
            xhr.ontimeout = () => { resolve(false); }
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                resolve(xhr.status > 0 && xhr.status < 400);
              }
            };
            xhr.onerror = () => { resolve(false); }
            xhr.onabort = () => { resolve(false); }
            xhr.open('HEAD', url);
            xhr.send();
        });
    }

    getMediaType(url: string) {
        if (this.isYoutubeUrl(url)) {
            return MediaType.YouTube;
        }

        return MediaType.Unknown;
    }

    getUnsafeUrl(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    getMediaEmbedUrl(mediaUrl: string) {
        const mediaType = this.getMediaType(mediaUrl);
        if (mediaType == MediaType.YouTube) {
            var videoId = this.getYoutubeId(mediaUrl);
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1`;
        }

        return '';
    }

    getMediaPreviewUrl(mediaUrl: string) {
        const mediaType = this.getMediaType(mediaUrl);
        if (mediaType == MediaType.YouTube) {
            var videoId = this.getYoutubeId(mediaUrl);
            return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        }

        return '';
    }

    getYoutubeId(url: string) {
        var id = ''; // get it from somewhere

        var youtubeRegExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
        var match = url.match(youtubeRegExp);

        if (match && match[1].length == 11) {
            id = match[1];
        }

        return id;
    }

    isYoutubeUrl(url: string) {
        return url != null && this.getYoutubeId(url).length > 0;
    }

}
