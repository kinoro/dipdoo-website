import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { AuthDataService } from 'src/app/data/auth-data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/validators/must-match';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styles: []
})
export class ResetPasswordComponent implements OnInit {

    @Input() email: string;
    @Input() token: string;
    
    public form: FormGroup;
    public submitted: boolean;
    public unknownError: boolean;

    isResetting: boolean;
    isSuccessful: boolean;
    hasResetPassword: boolean;

    public get f() { return this.form.controls; }

    constructor(
        private appService: AppService,
        private authData: AuthDataService,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6), Validators.pattern("(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z]).+")]],
            confirmPassword: ['', [Validators.required]]
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    async tryResetPassword() {
        this.submitted = true;
        this.unknownError = false;
        this.isResetting = true;

        if (this.form.invalid) {
            this.isResetting = false;
            return;
        }

        try {
            await this.authData.resetPassword(this.email, this.token, this.form.value.password);
            this.isSuccessful = true;
            this.isResetting = false;
        } catch (error) {
            console.log(error);
            this.unknownError = true;
            this.isResetting = false;
        }
    }
}