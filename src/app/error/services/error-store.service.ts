import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { Map } from "immutable";

import { ErrorModel } from '@app/error/models/error.model';
import { ErrorModelInterface } from '@app/error/models/error-model.interface';
import { ErrorData } from '@app/error/models/error-data.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorStoreService {
  public unreadErrors$: Observable<Array<ErrorData>>;

  private errorsSubject: ReplaySubject<Map<String, ErrorModel>>;
  private errors: Map<string, ErrorModel>;

  constructor() {
    this.errors = Map();
    this.errorsSubject = new ReplaySubject<Map<String, ErrorModel>>(1);

    this.unreadErrors$ = this.errorsSubject.asObservable().pipe(
      map(models => this.filterRead(models)),
      map(models => this.mapToData(models)),
      startWith([]),
      shareReplay(1)
    )
  }

  private filterRead(unfiltered: Map<String, ErrorModel>): Map<String, ErrorModel> {
    return unfiltered.filter(value => !value.isRead)
  }

  private mapToData(models: Map<String, ErrorModel>): Array<ErrorData> {
    return models.valueSeq()
      .map((model) => {
        return {
          id: model.id,
          name: model.name,
          message: model.message
        };
      })
      .toArray();
  }

  addError(err: ErrorModelInterface): void {
    const newError = new ErrorModel(err);
    const newId = newError.id;
    this.errors = this.errors.set(newId, newError);
    this.emitUpdateErrors();
  }

  private emitUpdateErrors(): void {
    this.errorsSubject.next(this.errors);
  }

  markAsRead(id: string): void {
    let valueAsRead = this.errors.get(id);
    valueAsRead.markAsRead();
    this.errors = this.errors.set(id, valueAsRead);
    this.emitUpdateErrors();
  }
}
