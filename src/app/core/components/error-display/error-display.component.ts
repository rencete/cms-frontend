import { Component, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { Subscription, Observable, of, Subject } from 'rxjs';

import { ErrorDisplayService } from "@core/services/error-display/error-display.service";
import { ErrorDisplayModel } from '@app/error/models/error-display-model';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'cms-error-display',
  templateUrl: './error-display.component.html',
  styleUrls: ['./error-display.component.css']
})
export class ErrorDisplayComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscription: Subscription;
  public errors$: Observable<ErrorDisplayModel[]>;

  constructor(private errorService: ErrorDisplayService) {
  }

  ngOnInit(): void {
    this.errors$ = this.errorService.newErrorAdded$.pipe(
      map(() => this.errorService.getUnreadErrors()),
      startWith(this.errorService.getUnreadErrors())
    )
  }

  ngAfterViewInit(): void {
  }

  private nextErrors(): void {
    let updatedErrors = [];
    updatedErrors = this.errorService.getUnreadErrors();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  markErrorAsRead(err: ErrorDisplayModel) {
    err.markAsRead();
  }
}
