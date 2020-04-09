import { Injectable } from '@angular/core';
import { ErrorDisplayModel } from '@app/core/models/error-display/error-display-model';

@Injectable({
  providedIn: 'root'
})
export class ErrorDisplayService {
  private errorsToBeDisplayed: ErrorDisplayModel[];

  constructor() {
    this.errorsToBeDisplayed = [];
  }

  addErrorToDisplay(err: Error): void {
    this.errorsToBeDisplayed.push(new ErrorDisplayModel(err));
  }

  getUnreadErrors(): ErrorDisplayModel[] {
    return this.errorsToBeDisplayed.filter(model => !model.isRead);
  }
}
