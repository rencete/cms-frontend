import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { ErrorFacade } from '@app/error/services/error-facade.service';
import { ErrorData } from '@app/error/models/error-data.model';

@Component({
  selector: 'error-container',
  template: `
    <error-list [errors]="errors$ | async" (dismiss)="markAsRead($event)"></error-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorContainerComponent {
  public errors$: Observable<ErrorData[]>;

  constructor(private facade: ErrorFacade) {
    this.errors$ = this.facade.getUnreadErrors();
  }

  markAsRead(id: string): void {
    this.facade.markErrorAsRead(id);
  }
}
