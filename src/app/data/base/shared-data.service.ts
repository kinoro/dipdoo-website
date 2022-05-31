import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { version } from 'src/app/app.version';
import { Observable, of, Subject, throwError } from 'rxjs';
import { TokenData } from './token-data';
import { HelperService } from 'src/app/services/helper-service';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private static readonly LOCAL_STORAGE_TOKEN_DATA = 'tokenData';
  private events: Subject<string>;

  authUrl: string = environment.authUrl;
  tokenData: TokenData = null;

  constructor(
    private http: HttpClient,
    private helperService: HelperService
  ) {
    this.events = new Subject<string>();
  }

  public listenToEvents(): Observable<string> {
    return this.events.asObservable();
  }

  public setTokenData(tokenData: TokenData) {
    this.tokenData = tokenData;
    localStorage.setItem(
      SharedDataService.LOCAL_STORAGE_TOKEN_DATA,
      JSON.stringify(tokenData)
    );
  }

  public clearTokenData() {
    this.tokenData = null;
    localStorage.removeItem(SharedDataService.LOCAL_STORAGE_TOKEN_DATA);

    this.events.next('clearTokenData');
  }

  public restoreTokenData() {
    const tokenDataJson = localStorage.getItem(
      SharedDataService.LOCAL_STORAGE_TOKEN_DATA
    );
    if (tokenDataJson != null && tokenDataJson.length > 0) {
      this.tokenData = JSON.parse(tokenDataJson);
    }
    return this.tokenData;
  }

  public async post<T>(
    url: string,
    data: any,
    options: CustomRequestOptions
  ): Promise<T> {
    return await this.tryRequestWithRefresh<T>(options, async () => {
      return await this.postInternal<T>(`${url}`, data, options);
    });
  }

  public async get<T>(url: string, options: CustomRequestOptions): Promise<T> {
    return await this.tryRequestWithRefresh<T>(options, async () => {
      return this.getInternal<T>(url, options);
    });
  }

  public async delete<T>(
    url: string,
    options: CustomRequestOptions
  ): Promise<T> {
    return await this.tryRequestWithRefresh<T>(options, async () => {
      return this.deleteInternal<T>(url, options);
    });
  }

  private async postInternal<T>(
    url: string,
    data: any,
    options: CustomRequestOptions
  ) {
    var promise =
      options != null
        ? this.http
            .post<T>(`${url}`, data, this.convertToHttpOptions(options))
            .toPromise()
        : this.http.post<T>(`${url}`, data).toPromise();

    return await this.processRequestPromise(promise);
  }

  private async getInternal<T>(url: string, options: CustomRequestOptions) {
    var promise = this.http
      .get<T>(url, this.convertToHttpOptions(options))
      .toPromise();
    return await this.processRequestPromise(promise);
  }

  private async deleteInternal<T>(url: string, options: CustomRequestOptions) {
    var promise = this.http
      .delete<T>(url, this.convertToHttpOptions(options))
      .toPromise();
    return await this.processRequestPromise(promise);
  }

  private async processRequestPromise<T>(promise: Promise<T>) {
    return new Promise<T>(async (resolve, reject) => {
      promise
        .then((x) => resolve(x))
        .catch((err) => {
          // Check if error model is an ApiResponse, by checking for known property 'isSuccess'
          if (err.error.isSuccess != null) {
            return resolve(err.error);
          } else {
            return reject(err);
          }
        });
    });
  }

  private hasTokenExpired(): boolean {
    var hasExpired = false;
    var expireXSecondsBeforeOfficialExpiry = 30;
    try {
      var authToken = this.tokenData != null ? this.tokenData.authToken : '';
      if (authToken != null && authToken != '') {
        var authTokenObj = JSON.parse(atob(authToken.split('.')[1]));
        var now = Math.floor(Date.now() / 1000);
        var hasExpired =
          now > authTokenObj.exp - expireXSecondsBeforeOfficialExpiry;
      }
    } finally {
      return hasExpired;
    }
  }

  private async tryRequestWithRefresh<T>(
    options: any,
    promise: () => Promise<T>
  ) {
    var hasTokenExpired = this.hasTokenExpired();

    if (hasTokenExpired && options.enableTryRefresh) {
      if (await this.tryRefresh(options, { status: 401 })) {
        try {
          return await promise();
        } catch (err) {
          throw err;
        }
      }
      throw 'Refresh failed';
    } else {
      try {
        return await promise();
      } catch (err) {
        if (!options.enableTryRefresh) {
          throw err;
        } else if (await this.tryRefresh(options, err)) {
          try {
            return await promise();
          } catch (err) {
            throw err;
          }
        }
        throw err;
      }
    }
  }

  private async tryRefresh(options: any, err: any): Promise<boolean> {
    if (err.status == 401) {
      if (
        options != null &&
        options.enableTryRefresh &&
        this.tokenData != null &&
        this.tokenData.refreshToken != null
      ) {
        try {
          var refreshToken = this.tokenData.refreshToken;
          var url = `${
            this.authUrl
          }/refresh?refreshToken=${encodeURIComponent(refreshToken)}`;
          var newTokenData = await this.get<TokenData>(
            url,
            this.options(false, false)
          );
          this.setTokenData(newTokenData);
          if (this.tokenData != null) {
            options.headers = this.getHeaders();

            // clear the token
            url = `${
              this.authUrl
            }/cleartoken?refreshToken=${encodeURIComponent(refreshToken)}`;
            await this.get<string>(url, this.options(true, false));

            return true;
          }
        } catch (err2) {
          if (err2.status == 401) {
            this.clearTokenData();
          }
          return false;
        }
      }

      this.clearTokenData();
    }

    return false;
  }

  public options(
    isTextResponse: boolean = false,
    enableTryRefresh = true
  ): CustomRequestOptions {
    var options = new CustomRequestOptions();
    options.headers = this.getHeaders();
    options.responseType = isTextResponse ? ('text' as 'json') : 'json';
    options.enableTryRefresh = enableTryRefresh;

    return options;
  }

  private getHeaders() {
    var authToken = this.tokenData != null ? this.tokenData.authToken : '';

    return new HttpHeaders({
      'Content-Type': `application/json`,
      Authorization: `Bearer ${authToken}`,
      'x-correlation-id': this.helperService.newGuid(),
      'x-mm-app-type': 'Website',
      'x-mm-app-version': `${version.major}.${version.minor}.${version.revision}.${version.build}`,
    });
  }

  private convertToHttpOptions(customRequestOptions: CustomRequestOptions): {
    headers?: any;
    responseType?: any;
  } {
    return {
      headers: customRequestOptions.headers,
      responseType: customRequestOptions.responseType,
    };
  }
}

export class CustomRequestOptions {
  headers?: HttpHeaders;
  responseType?: string;
  throwErrors?: boolean;
  enableTryRefresh?: boolean;
}
