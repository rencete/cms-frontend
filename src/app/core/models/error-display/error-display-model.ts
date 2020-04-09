export class ErrorDisplayModel {
    private read: boolean;
    private error: Error;

    constructor(err: Error) {
        this.read = false;
        this.error = err;
    }

    toString(): string {
        return this.error.toString();
    }

    isRead(): boolean {
        return this.read;
    }

    markAsRead(): void {
        this.read = true;
    }
}
