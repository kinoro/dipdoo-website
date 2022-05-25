import { Component, OnInit } from '@angular/core';
import { RegisterRequest, AuthDataService, LoginRequest } from 'src/app/data/auth-data.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AppService } from 'src/app/services/app.service';

@Component({
    selector: 'div[app-send-reset-password]',
    templateUrl: './send-reset-password.component.html',
    styles: [`
        .level-item {
            flex-shrink: 1;
        }
    `]
})
export class SendResetPasswordComponent implements OnInit {

    public hasSent: boolean;
    public token: string;
    public form: FormGroup;
    public submitted: boolean;
    public unknownError: boolean;
    public isSending: boolean;

    public get f() { return this.form.controls; }

    constructor(private authData: AuthDataService,
                private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    async sendResetPassword() {
        this.submitted = true;
        this.unknownError = false;
        this.isSending = true;

        if (this.form.invalid) {
            this.isSending = false;
            return;
        }

        try {
            await this.authData.sendResetPassword(this.form.value.email);
            this.hasSent = true;
            this.isSending = false;
        } catch (errorResponse) {
            this.unknownError = true;
            this.isSending = false;
        }
    }

    reset() {
        this.submitted = false;
        this.form.reset();
    }
}
