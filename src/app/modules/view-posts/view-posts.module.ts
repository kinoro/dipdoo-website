import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ViewPostsPostComponent } from './view-posts-post/view-posts-post.component';
import { ViewPostsTopbarComponent } from './view-posts-topbar/view-posts-topbar.component';
import { ViewPostsComponent } from './view-posts.component';

@NgModule({
   imports: [
    SharedModule
   ],
   declarations: [
      ViewPostsComponent,
      ViewPostsTopbarComponent,
      ViewPostsPostComponent,
   ],
   exports: [
      ViewPostsComponent
   ]
})
export class ViewPostsModule { }
