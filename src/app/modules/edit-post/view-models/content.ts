import { SafeResourceUrl } from "@angular/platform-browser";
import { ContentType } from "src/app/models/content-type";
import { ViewModel } from 'src/app/models/view-model';

export class Content extends ViewModel {
    public contentType: ContentType = ContentType.TextOnly;
    public image: Blob;
    public imageExt: string;
    public imageHostedUrl: string;
    public isImageTooBig: boolean;
    public imageUrl: string;
    public safeResourceUrl: SafeResourceUrl;

    sanitizeUrl(url): string {
        if (url == null) { return url; }
        if (!url.toLocaleLowerCase().startsWith('http://') && !url.toLocaleLowerCase().startsWith('https://')) {
            return `https://${url}`;
        }

        return url;
    }
}