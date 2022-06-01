import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ReportedPostSummary } from 'src/app/models/reported-post-summary copy';
import { AdminPostReportDataService } from 'src/app/data/admin-post-report-data.service';

@Component({
    selector: 'app-view-reported-posts-post',
    templateUrl: './view-reported-posts-post.component.html',
    styles: [`
        img {
            height: 95% !important;
            width: auto !important;
            margin: auto;
        }

        .image-outer-container-nonstandard {
            cursor: pointer;
            text-align: center !important;
            margin-top: 1rem;
            margin-bottom: 1rem;
            background-color: whitesmoke;
        }

        .image-outer-container-standard {
            cursor: pointer;
            margin-top: 1rem;
            margin-bottom: 1rem;
        }

        .view-content {
            margin-bottom: 0;
        }
    `]
})
export class ViewReportedPostsPostComponent implements OnInit, OnDestroy {

    @Input() post: ReportedPostSummary;
    @ViewChild('postImage') postImage: ElementRef;

    public isNonStandardResolution: boolean;
    public hasImageLoaded: boolean;
    public isSaving: boolean;
    public isSaved: boolean;

    get imageUrl() { return this.post.url; }
    get username() { return this.post.username; }
    get timeSince() { return this.appService.timeSince(this.post.createdAt); }
    get firstReportedAt() { return this.appService.dateString(this.post.firstReportedAt); }
    get numReports() { return this.post.numReports; }

    constructor(private appService: AppService,
        private adminPostReportData: AdminPostReportDataService
        ) { }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    viewPost() {
        this.appService.navigateTo(`/s/${this.post.room}/${this.post.dpId}`);
    }

    onPostImageLoaded() {
        const postImageEl: HTMLImageElement = this.postImage.nativeElement;
        this.isNonStandardResolution = postImageEl.naturalWidth != 800 || postImageEl.naturalHeight != 600;
        
        this.hasImageLoaded = true;
    }

    openUser() {
        this.appService.navigateTo(`/u/${this.post.username}`);
    }

    async block() {
        this.isSaving = true;

        try {
            await this.adminPostReportData.block(this.post.dpId);
            this.isSaving = false;
            this.isSaved = true;
        } catch (err) {
            this.isSaving = false;
            this.isSaved = false;
        }
    }

    async unreport() {
        this.isSaving = true;

        try {
            await this.adminPostReportData.unreport(this.post.dpId);
            this.isSaving = false;
            this.isSaved = true;
        } catch (err) {
            this.isSaving = false;
            this.isSaved = false;
        }
    }
}
