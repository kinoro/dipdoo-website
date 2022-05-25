import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class IsAdminGuard implements CanActivate {

    constructor(private appService: AppService, 
        private router: Router,
        private authService: AuthService) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return new Promise<boolean>((resolve, reject) => {
            this.authService.tryRestoreUser().then(() => {
                var canBrowse = this.appService.isSignedIn && this.authService.userAccount.isAdmin;
                resolve(canBrowse);
            });
        });
    }
}