import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterUserComponent } from './register-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
   imports: [
    SharedModule,
      ReactiveFormsModule,
      RecaptchaModule
   ],
   declarations: [
      RegisterUserComponent,
      ConfirmEmailComponent
   ],
   exports: [
      RegisterUserComponent,
      ConfirmEmailComponent
   ]
})
export class RegisterUserModule { }
