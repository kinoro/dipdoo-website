import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { SearchPostsService } from 'src/app/services/search-posts.service';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styles: [`
        .view-content {
            margin-bottom: 0;
        }

        .box {
            padding: 1rem 1rem 0.75rem 1rem;
        }

        .box-mobile-margin {
            margin-bottom: 0.5rem;
        }

        .box-desktop-margin {
            margin-bottom: 1.15rem;
            margin-left: 0.25rem;
            margin-right: 0.25rem;
        }
    `]
})
export class SearchBarComponent implements OnInit {

    @Input() inputSearchTerm: string;

    searchTerm: string;
    get isMobile(): boolean { return this.appService.isMobile; }

    constructor(private appService: AppService,
        private searchPostsService: SearchPostsService,
    ) { }

    ngOnInit() {
        this.searchTerm = this.inputSearchTerm != null ? this.inputSearchTerm : '';
    }

    initWithValue(val: string) { this.searchTerm = val; }

    search() {
        var errorMessage = this.searchPostsService.validateSearchTerm(this.searchTerm);
        if (errorMessage.length == 0) {
            this.appService.navigateTo(`/search/${this.searchTerm}`);
        } else {
            this.searchPostsService.hasLoadFailed = true;
            this.searchPostsService.errorMessage = errorMessage;
        }
    }
}
