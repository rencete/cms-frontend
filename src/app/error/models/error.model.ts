import { nanoid } from "nanoid";

import { ErrorModelInterface } from './error-model.interface';
import { ValueObject, hash } from 'immutable';

export class ErrorModel implements ValueObject {
    private _id: string;
    private _name: string;
    private _message: string;
    private read: boolean;
    private source: any;

    constructor(err: ErrorModelInterface) {
        this._id = nanoid();
        this._name = err.name;
        this._message = err.message
        this.read = false;
        this.source = err;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get message(): string {
        return this._message;
    }

    get isRead(): boolean {
        return this.read;
    }

    markAsRead(): void {
        this.read = true;
    }

    equals(other: any): boolean {
        if (other instanceof ErrorModel) {
            const comparedTo: ErrorModel = other;
            if (this._id === comparedTo.id &&
                this._name === comparedTo.name &&
                this._message === comparedTo.name &&
                this.read === comparedTo.isRead) {
                return true;
            }
        }
        return false;
    }

    hashCode(): number {
        let key = this.id;
        key += this.read ? "t" : "f";
        key += this._name;
        key += this._message;
        return hash(key);
    }

    toString(): string {
        let msg: string = "";
        msg += this._name || "";
        msg += (this._name && this._message) ? " : " : "";
        msg += this._message || "";
        return msg;
    }
}
