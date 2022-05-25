import { Injectable } from '@angular/core';
import { Post } from '../models/post';

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor() {
    }

    buildFriendlyId(post: Post): string {
        const maxLength = 100;
        let titlePortion = post.title.toLocaleLowerCase().replace(/[^0-9a-zA-Z ]/gi, '').split(' ').join('-');
        titlePortion = titlePortion.length > maxLength ? titlePortion.substring(0, maxLength) : titlePortion;
        return `${titlePortion}-${post.id}`;
    }
}
