import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { SearchPostsService } from 'src/app/services/search-posts.service';
import { TagService, TagValidity } from 'src/app/services/tag.service';
import { every } from 'rxjs/operators';
import { fakeAsync } from '@angular/core/testing';

@Component({
    selector: 'app-tags-panel',
    templateUrl: './tags-panel.component.html',
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

        .clickable {
            cursor: pointer;
        }
    `]
})
export class TagsPanelComponent implements OnInit {

    @Output() onSaveTags: EventEmitter<string> = new EventEmitter();
    @Input() showSavingUntilToldOtherwise: boolean = false;
    @Input() canClickTag: boolean = false;
    @Input() canEditTags: boolean = true;

    tagList: Array<string> = [];
    isEditingTags: boolean = false;
    isSavingTags: boolean;
    tags: string;
    errorMessage: string;

    get hasTags() { return this.tagList.length > 0; }
    get isMobile(): boolean { return this.appService.isMobile; }
    get hasErrorMessage(): boolean { return this.errorMessage != null && this.errorMessage.length > 0; }

    constructor(private appService: AppService,
        private tagService: TagService,
    ) { }

    ngOnInit() {
    }

    initWithValue(tags: string) { 
        this.tags = tags;
        this.tagList = this.tagService.convertTagsToTagList(this.tags);
        this.isEditingTags = false;
        this.errorMessage = null;
    }

    stopSaving() {
        this.isSavingTags = false;
    }

    clickTag(tag: string) {
        if (this.canClickTag) {
            this.appService.navigateTo(`/search/${tag}`);
        }
    }

    editTags() {
        this.tags = this.tagService.convertTagListToTags(this.tagList);
        this.isEditingTags = true;
    }

    cancelSaveTags() {
        this.isEditingTags = false;
        this.errorMessage = null;
    }

    onKeyDown(evt: KeyboardEvent) {
        if (this.tagService.getTagsValidity(evt.key) !== TagValidity.Valid) {
            evt.preventDefault();
            return false;
        }

        return true;
    }

    saveTags() {
        var tagsValidity = this.tagService.getTagsValidity(this.tags);
        if (tagsValidity == TagValidity.Valid) {
            this.tagList = this.tagService.convertTagsToTagList(this.tags);
            this.isEditingTags = false;
            this.errorMessage = null;
            this.isSavingTags = this.showSavingUntilToldOtherwise;
            this.onSaveTags.emit(this.tags);
        } else if (tagsValidity == TagValidity.InvalidDodgyCharacters) {
            this.errorMessage = "List of tags should only contain letter/numbers separated by commas";
        } else if (tagsValidity == TagValidity.InvalidCharacterLength) {
            this.errorMessage = "Tags must be between 1 and 16 characters in length";
        } else if (tagsValidity == TagValidity.InvalidTooManyTags) {
            this.errorMessage = "Posts can have a maximum of 10 tags";
        }
    }
}
