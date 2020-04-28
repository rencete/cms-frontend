import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ErrorData } from '@app/error/models/error-data.model';

@Component({
  selector: 'error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.css']
})
export class ErrorListComponent {
  @Input() errors: ErrorData[];
  @Output() dismiss = new EventEmitter<string>();

  dismissError(id: string) {
    this.dismiss.emit(id);
  }
}
