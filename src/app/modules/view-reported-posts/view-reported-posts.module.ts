import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewReportedPostsComponent } from './view-reported-posts.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ViewReportedPostsMainContentComponent } from './view-reported-posts-main-content/view-reported-posts-main-content.component';
import { ViewReportedPostsPostComponent } from './view-reported-posts-post/view-reported-posts-post.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
   imports: [
    SharedModule
   ],
   declarations: [
      ViewReportedPostsComponent,
      ViewReportedPostsMainContentComponent,
      ViewReportedPostsPostComponent
   ],
   exports: [
      ViewReportedPostsComponent
   ]
})
export class ViewReportedPostsModule { }
