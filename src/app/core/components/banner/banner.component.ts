import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

import { BannerData } from '@app/core/models/banner-data.model';
import { BannerService } from '@app/core/services/banner/banner.service';

@Component({
  selector: 'cms-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-150px)' }),
        animate("250ms cubic-bezier(0.0,0.0,0.2,1)")
      ]),
      transition(':leave', [
        animate("200ms cubic-bezier(0.4,0.0,1,1)",
        style({ transform: 'translateY(-150px)' }))
      ])
    ])
  ]
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
