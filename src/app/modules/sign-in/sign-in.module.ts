import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        ReactiveFormsModule,
    ],
    declarations: [
        SignInComponent
    ],
    exports: [
        SignInComponent
    ]
})
export class SignInModule { }
