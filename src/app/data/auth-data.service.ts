import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { Observable } from 'rxjs';
import { SharedDataService } from './base/shared-data.service';
import { TokenData } from '../models/token-data';

@Injectable({
  providedIn: 'root'
})
export class AuthDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async register(registerRequest: RegisterRequest): Promise<string> {
        return await this.sharedData.post<string>(`${this.authUrl}/register`, registerRequest, this.options(true));
    }

    public async confirm(email: string, emailConfirmationToken: string): Promise<TokenData> {
        var url = `${this.authUrl}/confirm?email=${encodeURIComponent(email)}&emailConfirmationToken=${encodeURIComponent(emailConfirmationToken)}`;

        return await this.sharedData.get<TokenData>(url, this.options());
    }

    public async sendResetPassword(email: string): Promise<string> {
        return await this.sharedData.post<string>(`${this.authUrl}/sendResetPassword`, { email }, this.options(true));
    }

    public async resetPassword(email: string, token: string, password: string): Promise<string> {
        return await this.sharedData.post<string>(`${this.authUrl}/resetPassword`, { email, token, password }, this.options(true));
    }

    public async refresh(refreshToken: string): Promise<TokenData> {
        var url = `${this.authUrl}/refresh?refreshToken=${encodeURIComponent(
          refreshToken
        )}`;
    
        return await this.sharedData.get<TokenData>(url, this.options());
      }

    public async login(loginRequest: LoginRequest): Promise<TokenData> {
        return await this.sharedData.post<TokenData>(
          `${this.authUrl}/auth`,
          loginRequest,
          this.options()
        );
      }

    public async cleartoken(refreshToken: string): Promise<string> {
        var url = `${this.authUrl}/cleartoken?refreshToken=${encodeURIComponent(refreshToken)}`;

        return await this.sharedData.get<string>(url, this.options(true));
    }
}

export class RegisterRequest {
    email: string;
    username: string;
    password: string;
}

export class LoginRequest {
    username: string = "";
    password: string = "";
    refreshToken: string = "";
}
