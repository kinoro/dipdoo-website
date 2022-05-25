import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoginRequest } from 'src/app/data/auth-data.service';
import { AppService } from 'src/app/services/app.service';
import { environment } from 'src/environments/environment';
import { UserAccount } from 'src/app/models/user-account';

@Component({
  selector: 'div[app-sign-in]',
  templateUrl: './sign-in.component.html',
  styles: [`
    .link {
        width: 100%;
        display: flex;
        justify-content: space-around;
        margin: 1rem 0rem 0rem 0rem;
        text-decoration: underline;
    }
  `]
})
export class SignInComponent implements OnInit {

    public form: FormGroup;
    public submitted: boolean;
    public errorMessage: string;
    public isWaiting: boolean;

    public get f() { return this.form.controls; }
    public get hasErrorMessage() { return this.errorMessage != null && this.errorMessage.length > 0; }

    constructor(private appService: AppService,
                private authService: AuthService,
                private router: Router,
                private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern("^[a-zA-Z0-9]*$")]],
            password: ['', [Validators.required, Validators.minLength(6), Validators.pattern("(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z]).+")]]
        });
    }

    async loginAsync() {
        if (this.isWaiting) { return; }
        if (environment.useTestData) { 
            this.authService.userAccount = new UserAccount(); 
            this.authService.userAccount.id = this.authService.userAccount.username = "TestData";
            this.authService.userAccount.isAdmin = true;
            this.appService.navigateTo(`/home`);
        }

        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.isWaiting = true;
        var model = this.form.value as LoginRequest;

        try {
            await this.authService.loginAndLoadUserAsync(model);
            if (this.authService.isSignedIn) {
                var redirectRoute = 'home';
                this.appService.navigateTo(`/${redirectRoute}`);
            }
        } catch (err) {
            this.errorMessage = "Sign in has failed";
        } finally {
            this.isWaiting = false;
        }
    }

    reset() {
        this.submitted = false;
        this.isWaiting = false;
        this.form.reset();
    }

}
