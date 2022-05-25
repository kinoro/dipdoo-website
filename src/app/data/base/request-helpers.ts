import { Observable, throwError, of } from 'rxjs';

export class RequestHelpers {
    
    /** Log a HeroService message with the MessageService */
    static log(message: string) {
        // do something more with this message?
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     * @param doRethrow - optional value which when true will rethrow the error
     */
    static handleError<T>(operation = 'operation', result?: T, doRethrow?: boolean) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            if (doRethrow.valueOf() === true) {
                return throwError(error);
            } else {
                return of(result as T);
            }
        };
    }
}