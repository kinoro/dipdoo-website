import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ModalResultType, ModalType } from '../models/modal-details';
import { AppService } from './app.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class CheckLoggedInService {

    constructor(private appService: AppService,
        private authService: AuthService) { 
    }

    async checkLoggedInAndEmailConfirmed(textLogin: string, textConfirm: string): Promise<boolean> {
        if (!this.authService.isSignedIn) {
            var modalResult = await this.appService.showModalAsync({
                modalType: ModalType.Button,
                title: "Login or register",
                text: textLogin,
                buttons: [ "Login", "Register" ]
            });

            if (modalResult.modalResultType == ModalResultType.Ok) {
                var route = modalResult.inputText == "Login" ? "/sign-in" : "/sign-up";
                this.appService.navigateTo(route);
            }
            
            return false;
        } else if (!this.authService.userAccount.isEmailConfirmed) {
            var modalResult = await this.appService.showModalAsync({
                modalType: ModalType.Prompt,
                title: "Please confirm your email",
                text: textConfirm
            });
            
            return false;
        }

        return true;
    }
}
