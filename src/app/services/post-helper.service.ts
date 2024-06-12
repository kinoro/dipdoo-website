import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
    providedIn: 'root'
})
export class PostHelperService {

    constructor() { 
    }

    getImageUrlOrDefault(post: Post) {
        return post.imageUrl?.length > 0 ? post.imageUrl : this.getDefaultImageUrl();
    }

    getDefaultImageUrl() {
        return `assets/icon-blue-faded-512.png`;
    }
}