import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewPostComponent } from './view-post.component';
import { ViewPostNewCommentComponent } from './view-post-new-comment/view-post-new-comment.component';
import { SharedModule } from '../shared/shared.module';
import { ViewPostCommentComponent } from './view-post-comment/view-post-comment.component';

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [ViewPostComponent,
        ViewPostNewCommentComponent,
        ViewPostCommentComponent,
    ],
    exports: [ViewPostComponent]
})
export class ViewPostModule { }
