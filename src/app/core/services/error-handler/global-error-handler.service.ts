import { Injectable, ErrorHandler, Injector } from '@angular/core';

import { ErrorDisplayService } from '@core/services/error-display/error-display.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private injector: Injector) {    
  }

  handleError(error: any): void {
    console.error(error);

    const errorDisplayService = this.injector.get(ErrorDisplayService);
    errorDisplayService.addErrorToDisplay(error);
  }
}
