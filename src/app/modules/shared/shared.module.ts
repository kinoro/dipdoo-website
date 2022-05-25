import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewPostSummaryComponent } from './view-post-summary/view-post-summary.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { TagsPanelComponent } from './tags-panel/tags-panel.component';
import { PostViewComponent } from './post-view/post-view.component';
import { PostOptionViewComponent } from './post-view/post-option-view.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  declarations: [
    ViewPostSummaryComponent,
    SearchBarComponent,
    TagsPanelComponent,
    PostViewComponent,
    PostOptionViewComponent,
  ],
  exports: [
    ViewPostSummaryComponent,
    SearchBarComponent,
    TagsPanelComponent,
    PostViewComponent,
    PostOptionViewComponent,
    CommonModule,
    RouterModule,
    FormsModule,
  ]
})
export class SharedModule { }
