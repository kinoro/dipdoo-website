import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { AuthDataService } from 'src/app/data/auth-data.service';
import { SharedDataService } from 'src/app/data/base/shared-data.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styles: []
})
export class ConfirmEmailComponent implements OnInit {

    confirmationStateEnum: any = ConfirmationState;

    @Input() email: string;
    @Input() emailConfirmationToken: string;
    
    isWaiting: boolean;
    isSuccessful: boolean;

    get isLoggedIn() { return this.appService.isSignedIn; }
    get state() {
        if (this.isWaiting) {
            return ConfirmationState.Waiting;
        } else if (this.isSuccessful) {
            return ConfirmationState.Succeeded;
        } {
            return ConfirmationState.Failed;
        }
    }

    get siteName() { return this.appService.siteName; }

    constructor(
        private appService: AppService,
        private authData: AuthDataService,
        private authService: AuthService,
        private sharedData: SharedDataService) {
    }

    ngOnInit() {
        this.isWaiting = true;
        this.tryConfirm();
    }

    async tryConfirm() {
        try {
            var tokenData = await this.authData.confirm(this.email, this.emailConfirmationToken);
            this.sharedData.setTokenData(tokenData);
            await this.authService.tryLoadUserAsync();
            this.isWaiting = false;
            this.isSuccessful = true;
        } catch (error) {
            this.isWaiting = false;
            console.log(error);
        }
    }
}

enum ConfirmationState
{
    Waiting,
    Succeeded,
    Failed
}