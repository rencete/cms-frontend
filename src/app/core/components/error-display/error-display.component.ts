import { Component, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { Subscription, Observable, of, Subject } from 'rxjs';

import { ErrorStoreService } from "@app/error/services/error-store.service";
import { ErrorModel } from '@app/error/models/error.model';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'cms-error-display',
  templateUrl: './error-display.component.html',
  styleUrls: ['./error-display.component.css']
})
export class ErrorDisplayComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscription: Subscription;
  public errors$: Observable<ErrorModel[]>;

  constructor(private errorService: ErrorStoreService) {
  }

  ngOnInit(): void {
    // this.errors$ = this.errorService.unreadErrors$.pipe(
    //   map(() => this.errorService.getUnreadErrors()),
    //   startWith(this.errorService.getUnreadErrors())
    // )
  }

  ngAfterViewInit(): void {
  }

  private nextErrors(): void {
    let updatedErrors = [];
    // updatedErrors = this.errorService.getUnreadErrors();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  markErrorAsRead(err: ErrorModel) {
    err.markAsRead();
  }
}
