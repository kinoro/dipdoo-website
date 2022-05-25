import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPostComponent } from './edit-post.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        SharedModule,
        ReactiveFormsModule,
    ],
    declarations: [
        EditPostComponent,
    ],
    exports: [EditPostComponent]
})
export class EditPostModule { }
