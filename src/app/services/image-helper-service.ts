import { Injectable } from '@angular/core';
import { ImageDetails } from '../models/ui/image-details';
import { ResolutionHelperService } from './resolution/resolution-helper.service';

@Injectable({
    providedIn: 'root'
})
export class ImageHelperService {

    static TargetAspectRatio = 4 / 3;

    constructor(private resolutionHelperService: ResolutionHelperService) {
    }

    public getImageDetails(imageElement: HTMLImageElement): ImageDetails {
        var imageDetails = new ImageDetails();
        // Changed so that its portrait if image is LESS than target aspect ratio
        //imageDetails.isPortrait = imageElement.naturalHeight >= imageElement.naturalWidth;
        imageDetails.isPortrait = (imageElement.naturalWidth / imageElement.naturalHeight) < ImageHelperService.TargetAspectRatio;
        imageDetails.isLandscape = !imageDetails.isPortrait;

        return imageDetails;
    }
}
