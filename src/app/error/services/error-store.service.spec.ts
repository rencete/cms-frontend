import { TestBed } from '@angular/core/testing';

import { ErrorDisplayService } from './error-store.service';

describe('ErrorDisplayService', () => {
  let service: ErrorDisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorDisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("allows adding of new errors", () => {
    expect(() => service.addErrorToDisplay(new Error("test"))).not.toThrow();
  });

  it("allows retrieving of unread errors", () => {
    expect(() => service.getUnreadErrors()).not.toThrow();
  });

  it("initial list of unread errors is empty", () => {
    expect(service.getUnreadErrors().length).toBe(0);
  });

  it("adding an error, adds it to the list of retrieved errors", () => {
    const testError = new Error("test");
    service.addErrorToDisplay(testError);

    expect(service.getUnreadErrors().length).toBe(1);
  });

  it("adding multiple errors, adds them to the list of retrieved errors", () => {
    const testError1 = new Error("test1");
    const testError2 = new Error("test2");
    const testError3 = new Error("test3");
    service.addErrorToDisplay(testError1);
    service.addErrorToDisplay(testError2);
    service.addErrorToDisplay(testError3);

    expect(service.getUnreadErrors().length).toBe(3);
  });

  it("marking an error as read, removes it from the list of retrieved errors", () => {
    const testError = new Error("test");
    service.addErrorToDisplay(testError);
    const retrievedErrorModel = service.getUnreadErrors()[0];
    retrievedErrorModel.markAsRead();

    expect(service.getUnreadErrors().length).toBe(0);
  });

  it("adding multiple errors, adds them to the list of retrieved errors", () => {
    const testError1 = new Error("test1");
    const testError2 = new Error("test2");
    const testError3 = new Error("test3");
    service.addErrorToDisplay(testError1);
    service.addErrorToDisplay(testError2);
    service.addErrorToDisplay(testError3);
    
    const retrievedErrorModel = service.getUnreadErrors()[0];
    retrievedErrorModel.markAsRead();

    expect(service.getUnreadErrors().length).toBe(2);
  });

  it("emits observable, when new error is added", () => {
    let timesCalled: number = 0;
    service.newErrorAdded$.subscribe(
      () => { timesCalled += 1; },
      (err) => { fail(); }
    );
    expect(timesCalled).toBe(0);

    const testError = new Error("test");
    service.addErrorToDisplay(testError);

    expect(timesCalled).toBe(1);
  });
})
