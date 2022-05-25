export class ViewModel {
    public get hasErrors() { return this.errorCodes != null && this.errorCodes.length > 0; }
    public errorCodes: Array<number> = [];
    public hasSubmitted: boolean;

    public hasErrorCode(errorCode: number) { 
        return this.errorCodes != null && this.errorCodes.find(x => x == errorCode) != null;
    }
}