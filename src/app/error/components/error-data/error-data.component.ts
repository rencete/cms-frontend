import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ErrorData } from '@app/error/models/error-data.model';

@Component({
  selector: 'error-data',
  templateUrl: './error-data.component.html',
  styleUrls: ['./error-data.component.css']
})
export class ErrorDataComponent {
  @Input() error: ErrorData;
  @Output() dismiss = new EventEmitter<string>();

  dismissError() {
    this.dismiss.emit(this.error.id);
  }
}
