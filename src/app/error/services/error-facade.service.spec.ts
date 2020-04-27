import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { ErrorFacade } from './error-facade.service';
import { ErrorStoreService } from './error-store.service';
import { ErrorData } from '../models/error-data.model';

describe('ErrorFacade', () => {
  let service: ErrorFacade;
  let mockStore: {
    unreadErrors$: Observable<ErrorData[]>;
    markAsRead: jasmine.Spy;
  };
  const testErrorData: ErrorData[] = [
    { id: "1", name: "Error 1", message: "This is sample error 1" },
    { id: "2", name: "Error 2", message: "This is sample error 2" },
    { id: "3", name: "Error 3", message: "This is sample error 3" },
  ];

  beforeEach(() => {
    let errorStoreMock = jasmine.createSpyObj("ErrorStoreService", ["markAsRead"]);
    errorStoreMock.unreadErrors$ = new Observable((subcriber) => {      
      subcriber.next(testErrorData);
    })

    TestBed.configureTestingModule({
      providers: [
        { provide: ErrorStoreService, useValue: errorStoreMock }
      ]
    });
    service = TestBed.inject(ErrorFacade);
    mockStore = TestBed.get(ErrorStoreService);
  });

  it('should get list of unread errors as observable', (done) => {
    let obs = service.getUnreadErrors();
    obs.subscribe(
      (values) => {
        expect(values).toEqual(testErrorData);
        done();
      }
    );
  });

  it('should pass Error ID to ErrorStore to mark as read', () => {
    const testId = "test-id";
    service.markErrorAsRead(testId);
    expect(mockStore.markAsRead).toHaveBeenCalledWith(testId);
  });
});
