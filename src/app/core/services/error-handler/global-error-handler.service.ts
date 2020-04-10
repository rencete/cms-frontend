import { Injectable, ErrorHandler, Injector } from '@angular/core';

import { ErrorDisplayService } from '@core/services/error-display/error-display.service';
import { RemoteLoggingService } from "@core/services/remote-logging/remote-logging.service";

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private injector: Injector) { }

  handleError(error: any): void {
    console.error(error);
    this.sendErrorToDisplayService(error);
    this.sendErrorToRemoteLoggingService(error);
  }

  private sendErrorToRemoteLoggingService(error: any) {
    const remoteLogginService = this.injector.get(RemoteLoggingService);
    remoteLogginService.remoteLog(error).subscribe(
      () => { },
      (err) => { 
        console.error(err);
        this.sendErrorToDisplayService(err);
      });
  }

  private sendErrorToDisplayService(error: any) {
    const errorDisplayService = this.injector.get(ErrorDisplayService);
    errorDisplayService.addErrorToDisplay(error);
  }
}