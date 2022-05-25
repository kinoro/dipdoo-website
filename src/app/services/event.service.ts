import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    public static EVENT_POST_DELETED = "post_deleted|";

    private events: Subject<string>;

    constructor() { 
        this.events = new Subject<string>();
    }

    raiseEvent(eventType: string) {
        this.events.next(eventType);
    }

    listen(): Observable<string> {
        return this.events.asObservable();
    }
}