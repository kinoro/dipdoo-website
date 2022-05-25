import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ViewUserService } from 'src/app/services/view-user.service';

@Component({
    selector: 'app-edit-user-profile',
    templateUrl: './edit-user-profile.component.html',
    styles: [`
    .label {
        font-weight: normal !important;
    }
    `]
})
export class EditUserProfileComponent implements OnInit, OnDestroy {

    get userAccount() { return this.viewUserService.userAccount; }
    get createdAt() { return this.appService.dateString(this.userAccount.createdAt);  }
    get createdAtTimeAgo() { return this.appService.timeSince(this.userAccount.createdAt);  }

    public isSaving = false;
    public isSaved = false;

    constructor(private appService: AppService,
                private viewUserService: ViewUserService) { }

    ngOnInit() {
        this.viewUserService.loadUserAsync(this.viewUserService.username, this.viewUserService.userTabType);
    }

    ngOnDestroy() {
    }

    async save() {
        this.isSaving = true;

        try
        {
            await this.viewUserService.update();
            this.isSaved = true;
            this.isSaving = false;
        } catch (err) {
            this.isSaved = false;
            this.isSaving = false;
        }

    }
}
