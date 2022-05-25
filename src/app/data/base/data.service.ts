import { Observable, of, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { SharedDataService } from './shared-data.service';
import { environment } from '../../../environments/environment';

export abstract class DataService {

    authUrl: string = environment.authUrl;
    baseUrl: string = environment.baseUrl;
    awsUrl: string = environment.awsUrl;

    constructor(protected sharedData: SharedDataService) {}

    protected options(isTextResponse: boolean = false) {
        return this.sharedData.options(isTextResponse);
    }
}
