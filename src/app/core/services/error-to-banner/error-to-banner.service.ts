import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { BannerService } from '../banner/banner.service';
import { ErrorFacade } from '@app/error/services/error-facade.service';
import { ErrorData } from '@app/error/models/error-data.model';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorToBannerService implements OnDestroy{
  private bannerId: string = "";
  private sub: Subscription;

  constructor(private banner: BannerService, private errorFacade: ErrorFacade) {
    this.sub = this.errorFacade.getUnreadErrors().pipe(
      filter((val) => this.shouldFilter(val))
    ).subscribe(
      (errors) => {
        if (errors.length === 0) {
          if (this.bannerId) {
            this.banner.cancelMessage(this.bannerId);
          }
          this.bannerId = "";
        } else {
          this.bannerId = this.banner.addMessage(
            "Oops, application encountered some error(s)",
            "error",
            "VIEW ERROR", undefined,
            "DISMISS", undefined);
        }
      }
    );
  }

  shouldFilter(arr: ErrorData[]): boolean {
    if (arr.length > 0 &&
      this.bannerId &&
      this.banner.hasMessage(this.bannerId)) {
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
