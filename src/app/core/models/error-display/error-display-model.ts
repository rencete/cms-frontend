export class ErrorDisplayModel {
    private read: boolean;
    private error: Error;

    constructor(err: Error) {
        this.error = err;
    }
}
