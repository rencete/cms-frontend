import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { BannerData } from '@app/core/models/banner-data.model';
import { BannerService } from '@app/core/services/banner/banner.service';

@Component({
  selector: 'cms-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerComponent implements OnInit {
  @Input() message$: Observable<BannerData>;

  constructor(private service: BannerService) { }

  ngOnInit(): void {
    this.message$ = this.service.message$;
  }

  dismissAction(): void {
    this.service.dismissMessage();
  }

  confirmAction(): void {
    this.service.confirmMessage();
  }
}
