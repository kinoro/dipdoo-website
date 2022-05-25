import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TagService {

    constructor() { 
    }

    public getTagsValidity(tags: string): TagValidity {
        if (tags == null || tags === '' ) { return TagValidity.Valid; }

        var invalidCharactersRegex = /^[a-z0-9,]+$/i;
        if (!invalidCharactersRegex.test(tags)) {
            return TagValidity.InvalidDodgyCharacters;
        }

        var tagList = this.convertTagsToTagList(tags);
        if (tagList.filter(x => x.length == 0 || x.length > 16).length > 0) {
            return TagValidity.InvalidCharacterLength;
        }

        if (tagList.length > 3) {
            return TagValidity.InvalidTooManyTags;
        }

        return TagValidity.Valid;
    }

    public convertTagsToTagList(tags: string): string[] {
        if (tags.trim() == "") { return []; }
        return tags.toLowerCase().split(',').map(x => x.trim()).filter(x => x != null && x.length > 0);
    }

    public convertTagListToTags(tagList: Array<string>) {
        return tagList == null ? "" : tagList.map(x => x.trim()).join(",");
    }

}

export enum TagValidity {
    Valid,
    InvalidDodgyCharacters,
    InvalidCharacterLength,
    InvalidTooManyTags
}
