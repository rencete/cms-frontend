import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { BannerService } from '../services/banner/banner.service';
import { ErrorToBannerService } from '../services/error-to-banner/error-to-banner.service';
import { BannerData } from '../models/banner-data.model';

@Component({
  selector: 'cms-base-template',
  templateUrl: './base-template.component.html',
  styleUrls: ['./base-template.component.css']
})
export class BaseTemplateComponent implements OnInit {
  public bannerInput$: Observable<BannerData>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private errorToBanner: ErrorToBannerService,
    private bannerService: BannerService
  ) {}

  ngOnInit() {
    this.bannerInput$ = this.bannerService.message$;
  }

  bannerAction(action: string): void {
    if (action == "confirm") {
      this.bannerService.confirmMessage();
    } else if (action === "dismiss") {
      this.bannerService.dismissMessage();
    }
  }
}
