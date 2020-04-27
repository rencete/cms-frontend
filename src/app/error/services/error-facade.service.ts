import { Injectable } from '@angular/core';

import { ErrorStoreService } from './error-store.service';
import { Observable } from 'rxjs';
import { ErrorData } from '../models/error-data.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorFacade {
  constructor(private store: ErrorStoreService) { }

  getUnreadErrors(): Observable<ErrorData[]> {
    return this.store.unreadErrors$;
  }

  markErrorAsRead(id: string): void {
    this.store.markAsRead(id);
  }
}
