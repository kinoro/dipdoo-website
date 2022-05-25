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

    optionFillerArray: Array<number> = [1, 2, 3, 4, 5, 6];
    mediaTypeEnum: any = MediaType;
    get optionFillers() { return this.optionFillerArray.filter(x => x > this.post.options.length); }
    get tagsArray() { return this.post.tags == null ? [] : this.post.tags; }

    constructor(private appService: AppService,
        private urlParsingService: UrlParsingService) { }

    ngOnInit() {

    }

    getMediaType(url: string): MediaType {
        return this.urlParsingService.getMediaType(url);
    }
}
