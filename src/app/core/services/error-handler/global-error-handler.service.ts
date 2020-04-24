import { Injectable, ErrorHandler, Injector } from '@angular/core';

import { ErrorStoreService } from '@app/error/services/error-store.service';
import { RemoteLoggingService } from "@core/services/remote-logging/remote-logging.service";
import { ErrorModelInterface } from '@app/error/models/error-model.interface';

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

  private sendErrorToDisplayService(error: ErrorModelInterface) {
    const errorStore = this.injector.get(ErrorStoreService);
    errorStore.addError(error);
  }
}