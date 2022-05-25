import { Injectable } from '@angular/core';
import { TokenData } from 'src/app/models/token-data';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RequestHelpers } from './request-helpers';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AppVersion } from 'src/app/app.version';

@Injectable({
    providedIn: 'root'
})
export class SharedDataService {

    private static readonly LOCAL_STORAGE_TOKEN_DATA = 'tokenData';
    authUrl: string = environment.authUrl;
    
    tokenData: TokenData;

    constructor(private http: HttpClient) { }

    public setTokenData(tokenData: TokenData) {
        this.tokenData = tokenData;
        localStorage.setItem(SharedDataService.LOCAL_STORAGE_TOKEN_DATA, JSON.stringify(tokenData));
    }

    public clearTokenData() {
        this.tokenData = null;
        localStorage.removeItem(SharedDataService.LOCAL_STORAGE_TOKEN_DATA);
    }

    public restoreTokenData() {
        const tokenDataJson = localStorage.getItem(SharedDataService.LOCAL_STORAGE_TOKEN_DATA);
        if (tokenDataJson != null && tokenDataJson.length > 0)
        {
            this.tokenData = JSON.parse(tokenDataJson);
        }
        return this.tokenData;
    }

    public async post<T>(url: string, data: any, options: { headers, responseType }): Promise<T> {
        try {
            var result = options != null
                ? await this.http.post<T>(`${url}`, data, options).pipe(
                    tap(_ => RequestHelpers.log(`Success - POST ${url}`)),
                    catchError(RequestHelpers.handleError<T>('error posting', null, true))
                ).toPromise()
                : await this.http.post<T>(`${url}`, data).pipe(
                    tap(_ => RequestHelpers.log(`Success - POST ${url}`)),
                    catchError(RequestHelpers.handleError<T>('error posting', null, true))
                ).toPromise();

            return result;
        } catch (err) {
            if (await this.tryRefresh(options, err)) {
                try {
                    var result = options != null
                    ? await this.http.post<T>(`${url}`, data, options).pipe(
                        tap(_ => RequestHelpers.log(`Success - POST ${url}`)),
                        catchError(RequestHelpers.handleError<T>('error posting', null, true))
                    ).toPromise()
                    : await this.http.post<T>(`${url}`, data).pipe(
                        tap(_ => RequestHelpers.log(`Success - POST ${url}`)),
                        catchError(RequestHelpers.handleError<T>('error posting', null, true))
                    ).toPromise();
        
                    return result;
                } catch (err) {
                    throw err;
                }
            }

            throw err;
        }
    }

    public async get<T>(url: string, options: { headers, responseType }): Promise<T> {
        try {
            var result = await this.http.get<T>(url, options).pipe(
                tap(_ => RequestHelpers.log(`Success - GET ${url}`)),
                catchError(RequestHelpers.handleError<T>('error getting', null, true))
            ).toPromise();

            return result;
        } catch (err) {
            if (await this.tryRefresh(options, err)) {
                try {
                    var result = await this.http.get<T>(url, options).pipe(
                        tap(_ => RequestHelpers.log(`Success - GET ${url}`)),
                        catchError(RequestHelpers.handleError<T>('error getting', null, true))
                    ).toPromise();
        
                    return result;
                } catch (err) {
                    throw err;
                }
            }
            throw err;
        }
    }

    public async delete<T>(url: string, options: { headers, responseType }): Promise<T> {
        try {
            var result = await this.http.delete<T>(url, options).pipe(
                tap(_ => RequestHelpers.log(`Success - DELETE ${url}`)),
                catchError(RequestHelpers.handleError<T>('error deleting', null, true))
            ).toPromise();

            return result;
        } catch (err) {
            if (await this.tryRefresh(options, err)) {
                try {
                    var result = await this.http.delete<T>(url, options).pipe(
                        tap(_ => RequestHelpers.log(`Success - DELETE ${url}`)),
                        catchError(RequestHelpers.handleError<T>('error deleting', null, true))
                    ).toPromise();
        
                    return result;
                } catch (err) {
                    throw err;
                }
            }
            throw err;
        }
    }

    private async tryRefresh(options, err): Promise<boolean> {
        if (err.status == 401) {
            if (options != null && options.enableTryRefresh && this.tokenData != null && this.tokenData.refreshToken != null) {
                try {
                    var refreshToken = this.tokenData.refreshToken;
                    var url = `${this.authUrl}/refresh2?refreshToken=${encodeURIComponent(refreshToken)}`;
                    this.setTokenData(await this.get<TokenData>(url, this.options(false, false)));
                    if (this.tokenData != null) {
                        options.headers = this.getHeaders();

                        // clear the token
                        url = `${this.authUrl}/cleartoken?refreshToken=${encodeURIComponent(refreshToken)}`;
                        await this.get<string>(url, this.options(true, false))

                        return true;
                    }
                } catch {
                    this.tokenData = null;
                    return false;
                }
            }

            this.tokenData = null;
        }
        
        return false;
    }

    public options(isTextResponse: boolean = false, enableTryRefresh = true) {
        return {
            headers: this.getHeaders(),
            responseType: isTextResponse ? 'text' as 'json' : 'json',
            enableTryRefresh
        };
    }

    private getHeaders() {
        var authToken = this.tokenData != null
            ? this.tokenData.authToken
            : '';
        var clientId = this.tokenData != null
            ? this.tokenData.userAccountId
            : '';

        return new HttpHeaders({
            'Content-Type': `application/json`,
            'X-ClientId': clientId,
            Authorization: `Bearer ${authToken}`,
            'x-pe-app-type': 'Website',
            'x-pe-app-version': AppVersion.VersionString
        });
    }
}
