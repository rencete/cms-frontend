import { TestBed } from '@angular/core/testing';

import { ErrorDisplayService } from './error-display.service';

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

  it("marking an error as read, removes it from the list of retrieved errors", () => {
    const testError = new Error("test");
    service.addErrorToDisplay(testError);
    const retrievedErrorModel = service.getUnreadErrors().shift();
    retrievedErrorModel.markAsRead();

    expect(service.getUnreadErrors().length).toBe(0);
  });
});
