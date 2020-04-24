import { nanoid } from "nanoid";

export class ErrorModel {
    id: string;
    name: string;
    message: string;
    
    private read: boolean;
    private source: any;

    constructor(err: ErrorModelInterface) {
        this.id = nanoid();
        this.name = err.name;
        this.message = err.message
        this.read = false;
        this.source = err;
    }

    toString(): string {
        return this.source.toString();
    }

    get isRead(): boolean {
        return this.read;
    }

    markAsRead(): void {
        this.read = true;
    }
}

interface ErrorModelInterface {
    name: string;
    message: string
}
