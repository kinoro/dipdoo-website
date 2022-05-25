import { Injectable } from '@angular/core';
import { DrawMode } from 'src/app/enums/canvas/draw-mode';

@Injectable({
    providedIn: 'root'
})
export class ResolutionHelperService {

    static STANDARD_LANDSCAPE_WIDTH = 800;
    static STANDARD_LANDSCAPE_HEIGHT = 600;

    get standardPortraitDimensions() { return {
        width: ResolutionHelperService.STANDARD_LANDSCAPE_HEIGHT,
        height: ResolutionHelperService.STANDARD_LANDSCAPE_WIDTH};
    }

    get standardLandscapeDimensions() { return {
        width: ResolutionHelperService.STANDARD_LANDSCAPE_WIDTH,
        height: ResolutionHelperService.STANDARD_LANDSCAPE_HEIGHT};
    }

    get standardSquareDimensions() { return {
        width: ResolutionHelperService.STANDARD_LANDSCAPE_WIDTH,
        height: ResolutionHelperService.STANDARD_LANDSCAPE_WIDTH};
    }

    constructor() {
    }

    getDefaultDimensions(isDesktop: boolean, isViewPortait: boolean, drawMode: DrawMode) {
        if (drawMode === DrawMode.PixelArt) {
            return this.standardSquareDimensions;
        } else {
            return (isDesktop || !isViewPortait) ? this.standardLandscapeDimensions : this.standardPortraitDimensions;
        }
    }

    areDimensionsStandard(width: number, height: number) {
        return (width === ResolutionHelperService.STANDARD_LANDSCAPE_WIDTH && height === ResolutionHelperService.STANDARD_LANDSCAPE_HEIGHT)
            || (width === ResolutionHelperService.STANDARD_LANDSCAPE_HEIGHT && height === ResolutionHelperService.STANDARD_LANDSCAPE_WIDTH)
            || (width === ResolutionHelperService.STANDARD_LANDSCAPE_WIDTH && height === ResolutionHelperService.STANDARD_LANDSCAPE_WIDTH);
    }

    rotateDimensions(width: number, height: number): { width: number, height: number } {
        return {
            width: height,
            height: width
        };
    }
}
