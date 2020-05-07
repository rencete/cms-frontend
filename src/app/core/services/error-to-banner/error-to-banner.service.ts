import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

import { BannerService } from '../banner/banner.service';
import { ErrorFacade } from '@app/error/services/error-facade.service';
import { ErrorData } from '@app/error/models/error-data.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorToBannerService implements OnDestroy {
  private bannerId: string = "";
  private sub: Subscription;
  private previousCount = 0;

  constructor(
    private banner: BannerService,
    private errorFacade: ErrorFacade,
    private router: Router
  ) {
    this.sub = this.errorFacade.getUnreadErrors().pipe(
      filter((val) => this.shouldPassFilter(val))
    ).subscribe(
      (errors) => {
        if (errors.length === 0) {
          if (this.bannerId) {
            this.banner.cancelMessage(this.bannerId);
          }
          this.bannerId = "";
        } else {
          this.bannerId = this.banner.addMessage(
            "Oops, this application has encountered some error(s).",
            "error",
            "View error", () => {
              this.router.navigateByUrl("/error");
            },
            "Dismiss", undefined);
        }
      }
    );
  }

  shouldPassFilter(arr: ErrorData[]): boolean {
    if (arr.length > 0 && arr.length < this.previousCount) {
      return false;
    }
    this.previousCount = arr.length;

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
