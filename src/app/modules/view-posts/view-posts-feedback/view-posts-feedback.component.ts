import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Post } from 'src/app/models/post';
import { UrlParsingService } from 'src/app/services/url-parsing.service';
import { MediaType } from 'src/app/models/media-type';

@Component({
    selector: 'app-view-posts-feedback',
    templateUrl: './view-posts-feedback.component.html',
    styles: []
})
export class ViewPostsFeedbackComponent implements OnInit {

    @Input() ordinal: number;

    constructor() { }

    ngOnInit() {

    }
}
