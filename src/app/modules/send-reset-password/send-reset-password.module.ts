import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SendResetPasswordComponent } from './send-reset-password.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
   imports: [
    SharedModule,
      ReactiveFormsModule,
   ],
   declarations: [
      ResetPasswordComponent,
      SendResetPasswordComponent
   ],
   exports: [
      ResetPasswordComponent,
      SendResetPasswordComponent
   ]
})
export class SendResetPasswordModule { }
