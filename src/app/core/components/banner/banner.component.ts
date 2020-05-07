import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

import { BannerData } from '@app/core/models/banner-data.model';

@Component({
  selector: 'cms-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: '0px' }),
        animate("250ms cubic-bezier(0.0,0.0,0.2,1)")
      ]),
      transition(':leave', [
        animate("200ms cubic-bezier(0.4,0.0,1,1)",
        style({ height: '0px' }))
      ])
    ])
  ]
})
export class BannerComponent {
  @Input() message$: Observable<BannerData>;
  @Output() dismiss = new EventEmitter();
  @Output() confirm = new EventEmitter();

  dismissAction(): void {
    this.dismiss.emit();
  }

  confirmAction(): void {
    this.confirm.emit();
  }
}
