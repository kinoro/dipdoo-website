import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthEventService {

    private events: Subject<AuthEventType>;

    constructor() { 
        this.events = new Subject<AuthEventType>();
    }

    raiseEvent(eventType: AuthEventType) {
        this.events.next(eventType);
    }

    listen(): Observable<AuthEventType> {
        return this.events.asObservable();
    }
}

export enum AuthEventType {
    LoggedIn,
    LoggedOut
}
