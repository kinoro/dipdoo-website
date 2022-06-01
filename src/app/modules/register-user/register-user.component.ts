import { Component, OnInit } from '@angular/core';
import { RegisterRequest, AuthDataService, LoginRequest } from 'src/app/data/auth-data.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MustMatch } from 'src/app/validators/must-match';
import { AuthService } from 'src/app/services/auth.service';
import { AppService } from 'src/app/services/app.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'div[app-register-user]',
    templateUrl: './register-user.component.html',
    styles: [`
        .level-item {
            flex-shrink: 1;
        }
    `]
})
export class RegisterUserComponent implements OnInit {

    public hasRegistered: boolean;
    public confirmationToken: string;
    public form: FormGroup;
    public submitted: boolean;
    public unknownError: boolean;
    public isWaiting: boolean;

    public nextRouteButtonText: string;
    public nextRoute: string;

    public get hasConfirmationLink(): boolean { return this.confirmationToken != null && this.confirmationToken.length > 0; }
    public get f() { return this.form.controls; }
    public get recaptchaSiteKey() { return environment.recaptchaSiteKey; }
    recaptchaToken: string;

    constructor(private authData: AuthDataService, 
                private authService: AuthService,
                private appService: AppService,
                private router: Router, 
                private formBuilder: FormBuilder,) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern("^[a-zA-Z0-9]*$")]],
            password: ['', [Validators.required, Validators.minLength(6), Validators.pattern("(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z]).+")]],
            confirmPassword: ['', [Validators.required]],
            acceptTerms: [false, [Validators.requiredTrue]]
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    async register() {
        this.submitted = true;
        this.unknownError = false;

        if (this.form.invalid) {
            return;
        }

        this.isWaiting = true;

        var model = this.form.value as RegisterRequest;
        model.recaptchaToken = this.recaptchaToken;

        try {
            var response = await this.authData.register(model);
            this.confirmationToken = (response != null && response.length > 0) ? response : null;
            await this.finishRegisterAndLogin();
        } catch (errorResponse) {
            var errorMessage = errorResponse.error.toString().toLowerCase();
            if (errorMessage.includes("duplicateusername")) {
                this.form.get('username').setErrors({
                    notunique: true
                })
            } else if (errorMessage.includes("duplicateemail")) {
                this.form.get('email').setErrors({
                    notunique: true
                })
            } else {
                this.unknownError = true;
            }
        } finally {
            this.isWaiting = false;
        }
    }

    public recaptchaResolved(token) {
        this.recaptchaToken = token;
    }

    async finishRegisterAndLogin() {
        this.nextRoute = "home";
        this.nextRouteButtonText = "Continue";

        var model = this.form.value as LoginRequest;
        await this.authService.loginAndLoadUserAsync(model);

        this.hasRegistered = true;

        this.goToNextRoute();
    }

    reset() {
        this.submitted = false;
        this.form.reset();
    }

    goToNextRoute() {
        this.appService.navigateTo(`/${this.nextRoute}`);
    }

    goToConfirm() {
        this.router.navigate(['/confirm-email'], { queryParams: { 
            email: this.form.get('email').value, 
            emailConfirmationToken: this.confirmationToken 
        }});
    }
}
