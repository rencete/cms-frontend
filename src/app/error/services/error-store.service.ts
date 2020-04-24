import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ErrorModel } from '@app/error/models/error.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorDisplayService {
  public newErrorAdded$: Observable<ErrorModel>;
  private newErrorAdded: Subject<ErrorModel>;
  private errorsToBeDisplayed: ErrorModel[];  

  constructor() {
    this.newErrorAdded = new Subject<ErrorModel>();
    this.newErrorAdded$ = this.newErrorAdded.asObservable();
    this.errorsToBeDisplayed = [];
  }

  addErrorToDisplay(err: Error): void {
    const newError = new ErrorModel(err);
    this.errorsToBeDisplayed.push(newError);
    this.newErrorAdded.next(newError);
  }

  getUnreadErrors(): ErrorModel[] {
    return this.errorsToBeDisplayed.filter(model => !model.isRead);
  }
}
