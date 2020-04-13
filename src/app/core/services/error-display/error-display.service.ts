import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ErrorDisplayModel } from '@app/core/models/error-display/error-display-model';

@Injectable({
  providedIn: 'root'
})
export class ErrorDisplayService {
  public newErrorAdded$: Observable<ErrorDisplayModel>;
  private newErrorAdded: Subject<ErrorDisplayModel>;
  private errorsToBeDisplayed: ErrorDisplayModel[];  

  constructor() {
    this.newErrorAdded = new Subject<ErrorDisplayModel>();
    this.newErrorAdded$ = this.newErrorAdded.asObservable();
    this.errorsToBeDisplayed = [];
  }

  addErrorToDisplay(err: Error): void {
    const newError = new ErrorDisplayModel(err);
    this.errorsToBeDisplayed.push(newError);
    this.newErrorAdded.next(newError);
  }

  getUnreadErrors(): ErrorDisplayModel[] {
    return this.errorsToBeDisplayed.filter(model => !model.isRead);
  }
}
