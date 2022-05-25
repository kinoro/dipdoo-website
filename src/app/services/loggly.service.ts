import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LogglyService {

    // https://github.com/loggly/loggly-jslogger
    private loggly: any = new LogglyTracker();

    constructor() { 
        this.loggly.push({
            logglyKey: 'b7a8c6ac-8286-4b1a-a06c-6b26f103b89d',
            sendConsoleErrors: false,
            tag: 'ponderegg-website-logs'
        });
    }

    log(error: Error) {
        if (environment.production == true)
        {
            // do not push error as it will fail due to circular structure
            this.loggly.push({ message: error.message, stack: error.stack });
        }
        else
        {
            console.error(error);
        }
      }
}
