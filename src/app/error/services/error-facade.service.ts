import { Injectable } from '@angular/core';

import { ErrorStoreService } from './error-store.service';
import { Observable } from 'rxjs';
import { ErrorData } from '../models/error-data.model';
import { ErrorModelInterface } from '../models/error-model.interface';
import { RemoteLoggingService } from '@app/core/services/remote-logging/remote-logging.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorFacade {
  constructor(
    private store: ErrorStoreService,
    private remoteLogger: RemoteLoggingService
  ) { }

  getUnreadErrors(): Observable<ErrorData[]> {
    return this.store.unreadErrors$;
  }

  markErrorAsRead(id: string): void {
    this.store.markAsRead(id);
  }

  handleError(err: ErrorModelInterface): void {
    this.addToStore(err);
    this.sendToRemoteLog(err);
  }

  private addToStore(err: ErrorModelInterface) {
    this.store.addError(err);
  }

  private sendToRemoteLog(err: ErrorModelInterface) {
    let obs = this.remoteLogger.remoteLog(err)
    obs.subscribe(
      () => { },
      (errorResponse) => {
        console.log(errorResponse);
        this.addToStore(errorResponse);
      }
    );
  }
}
