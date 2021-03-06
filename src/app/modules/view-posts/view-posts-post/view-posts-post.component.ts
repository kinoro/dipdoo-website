import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Post } from 'src/app/models/post';
import { UrlParsingService } from 'src/app/services/url-parsing.service';
import { MediaType } from 'src/app/models/media-type';

@Component({
    selector: 'app-view-posts-post',
    templateUrl: './view-posts-post.component.html',
    styles: []
})
export class ViewPostsPostComponent implements OnInit {

    @Input() post: Post;
    @Input() ordinal: number;

    constructor() { }

    ngOnInit() {

    }
}
