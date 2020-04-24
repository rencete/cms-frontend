import { TestBed } from '@angular/core/testing';

import { ErrorStoreService } from './error-store.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorData } from '@app/error/models/error-data.model';

describe('ErrorStoreService', () => {
  let service: ErrorStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("allows adding of new errors", () => {
    let testFn = () => {
      service.addError(new Error("test"));
    }
    expect(testFn).not.toThrow();
  });

  it("allows adding of http response errors", () => {
    const httpError = new HttpErrorResponse({ error: null, status: 404, statusText: "custom error" });
    let testFn = () => {
      service.addError(httpError);
    }
    expect(testFn).not.toThrow();
  });

  it("initial list of unread errors is empty", (done) => {
    getUnreadValuesFromObservable(0, done);
  });

  function getUnreadValuesFromObservable(expectedCount: number, cb: Function) {
    service.unreadErrors$.subscribe((values) => {
      expect(values.length).toBe(expectedCount);
      cb();
    }, (err) => {
      fail("Should not error");
    }, () => {
      fail("Should not complete");
    });
  }

  it("adding an error, adds it to the list of retrieved errors", (done) => {
    const testError = new Error("test");
    service.addError(testError);

    getUnreadValuesFromObservable(1, done);
  });

  it("adding multiple errors, adds them to the list of retrieved errors", (done) => {
    const testError1 = new Error("test1");
    const testError2 = new Error("test2");
    const testError3 = new Error("test3");
    service.addError(testError1);
    service.addError(testError2);
    service.addError(testError3);

    getUnreadValuesFromObservable(3, done);
  });

  it("marking an error as read, removes it from the list of retrieved errors", (done) => {
    const indexToMarkAsRead = 1;
    const testError1 = new Error("test1");
    const testError2 = new Error("test2");
    const testError3 = new Error("test3");
    service.addError(testError1);
    service.addError(testError2);
    service.addError(testError3);

    let passes = 0;
    let ids = [];
    function prepareIdsThatWereNotMarkedRead(values: ErrorData[]) {
      ids = values.map((v) => v.id);
      ids.splice(indexToMarkAsRead, 1);
    }

    service.unreadErrors$.subscribe((values) => {
      passes++;
      if (passes != 2) {
        prepareIdsThatWereNotMarkedRead(values);
        service.markAsRead((values[indexToMarkAsRead].id));
      }
      else {
        expect(values.length).toBe(2);
        ids.forEach((id) => {
          expect(values.some(v => v.id === id)).toBe(true);
        })
        done();
      }
    }, (err) => {
      fail("Should not error");
    }, () => {
      fail("Should not complete");
    });
  });
});

