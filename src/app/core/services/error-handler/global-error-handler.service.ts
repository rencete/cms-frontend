import { Injectable, ErrorHandler, Injector } from '@angular/core';

import { ErrorModelInterface } from '@app/error/models/error-model.interface';
import { ErrorFacade } from '@app/error/services/error-facade.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private injector: Injector) { }

  handleError(error: any): void {
    console.error(error);
    this.sendToErrorFacade(error);
  }

  private sendToErrorFacade(error: ErrorModelInterface) {
    const errorFacade = this.injector.get(ErrorFacade);
    errorFacade.handleError(error);
  }
}