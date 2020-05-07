import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { trigger, transition, useAnimation } from '@angular/animations';

import { BannerData } from '@app/core/models/banner-data.model';
import { growFrom0ToSize } from '@app/shared/animations/grow-from-0-to-size.animation';
import { shrinkFromSizeTo0 } from '@app/shared/animations/shrink-from-size-to-0.animation';

@Component({
  selector: 'cms-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        useAnimation(growFrom0ToSize, {
          params: { time: '250ms' }
        })
      ]),
      transition(':leave', [
        useAnimation(shrinkFromSizeTo0, {
          params: { time: '200ms' }
        })
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
