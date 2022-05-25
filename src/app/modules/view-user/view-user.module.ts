import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewUserComponent } from './view-user.component';
import { ViewUserProfileComponent } from './view-user-profile/view-user-profile.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EditUserProfileComponent } from './edit-user-profile/edit-user-profile.component';
import { ViewUserPostsComponent } from './view-user-posts/view-user-posts.component';
import { ViewUserPostComponent } from './view-user-post/view-user-post.component';
import { ViewUserUserSummarysComponent } from './view-user-usersummarys/view-user-usersummarys.component';
import { ViewUserUserSummaryComponent } from './view-user-usersummary/view-user-usersummary.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [
        ViewUserComponent,
        ViewUserProfileComponent,
        EditUserProfileComponent,
        ViewUserPostComponent,
        ViewUserPostsComponent,
        ViewUserUserSummarysComponent,
        ViewUserUserSummaryComponent,
    ],
    exports: [
        ViewUserComponent
    ]
})
export class ViewUserModule { }
