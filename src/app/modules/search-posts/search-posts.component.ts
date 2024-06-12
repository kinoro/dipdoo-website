import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { PostSummary } from 'src/app/models/post-summary';
import { PostListOrderBy } from 'src/app/enums/post/post-list-order-by';
import { RoomType } from 'src/app/enums/post/room-type';
import { SearchPostsService } from 'src/app/services/search-posts.service';
import { SearchBarComponent } from '../shared/search-bar/search-bar.component';
import { ViewPostsService } from 'src/app/services/view-posts.service';

@Component({
    selector: 'app-search-posts',
    templateUrl: './search-posts.component.html',
    styles: [`
        .hero-body .container .title {
            text-transform: capitalize;
        }
    `]
})
export class SearchPostsComponent implements OnInit, AfterViewInit {

    @ViewChild(SearchBarComponent) searchBar: SearchBarComponent;

    @Input() public searchTerm: string;

    get postModels(): Array<PostSummary> { return this.searchPostsService.posts; }
    get hasLoaded(): boolean { return this.postModels != null || this.searchPostsService.isEmpty; }
    get hasFailed(): boolean { return this.searchPostsService.hasLoadFailed; }
    get isMobile(): boolean { return this.appService.isMobile; }
    get isLoggedIn(): boolean { return this.appService.isSignedIn; }
    get isLoadingPosts(): boolean { return this.searchPostsService.isLoadingPosts; }
    get errorMessage(): string { return this.searchPostsService.errorMessage; }

    public orderByEnum: any = PostListOrderBy;
    public roomTypeEnum: any = RoomType;

    constructor(private searchPostsService: SearchPostsService,
                private appService: AppService,
                private viewPostsService: ViewPostsService) { }

    ngOnInit() {
        this.searchPostsService.unload();
        if (this.searchTerm != null && this.searchTerm.length > 0) {
            console.log("searching with query string term: " + this.searchTerm);
            this.searchPostsService.searchAsync(this.searchTerm);
        } else {
            this.searchPostsService.loadEmpty();
        }
    }
    
    ngAfterViewInit() {
        setTimeout(() => {
            if (this.searchTerm != null && this.searchTerm.length > 0) {
                this.searchBar.initWithValue(this.searchTerm);
            }
        });
        
    }

    public switchFilter(orderBy: PostListOrderBy) {
    }
}
