import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SearchPostsComponent } from './search-posts.component';
import { SearchPostsMainContentComponent } from './search-posts-main-content/search-posts-main-content.component';

@NgModule({
   imports: [
    SharedModule
   ],
   declarations: [
      SearchPostsComponent,
      SearchPostsMainContentComponent,
   ],
   exports: [
      SearchPostsComponent
   ]
})
export class SearchPostsModule { }
