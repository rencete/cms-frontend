import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { ErrorToBannerService } from './error-to-banner.service';
import { ErrorFacade } from '@app/error/services/error-facade.service';
import { BannerService } from '../banner/banner.service';
import { ErrorData } from '@app/error/models/error-data.model';

describe('ErrorToBannerService', () => {
  let service: ErrorToBannerService;
  let mockFacade: {
    getUnreadErrors: jasmine.Spy;
  };
  let mockErrors$: Subject<ErrorData[]> = new Subject<ErrorData[]>();
  let mockBanner: {
    addMessage: jasmine.Spy;
    hasMessage: jasmine.Spy;
    cancelMessage: jasmine.Spy;
  };
  let testError: ErrorData = {
    id: "test-id",
    name: "Sample",
    message: "This is a sample error message"
  };
  const fakeMessageId = "fake-id";

  beforeEach(() => {
    mockFacade = jasmine.createSpyObj("ErrorFacade", ["getUnreadErrors"]);
    mockFacade.getUnreadErrors.and.callFake(() => {
      return mockErrors$.asObservable();
    });
    mockBanner = jasmine.createSpyObj("BannerService", ["addMessage", "hasMessage", "cancelMessage"]);
    mockBanner.addMessage.and.returnValue("fake-id");
    mockBanner.hasMessage.and.callFake((id) => {
      return id === fakeMessageId;
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ErrorFacade, useValue: mockFacade },
        { provide: BannerService, useValue: mockBanner }
      ]
    });
    service = TestBed.inject(ErrorToBannerService);
  });

  it('should not send a message at the start', fakeAsync(() => {
    expect(mockBanner.addMessage).not.toHaveBeenCalled();
  }));

  it('should add a message to banner when receiving an error', fakeAsync(() => {
    mockErrors$.next([testError]);
    expect(mockBanner.addMessage).toHaveBeenCalledTimes(1);
  }));

  it('should not add another message to banner when receiving message is still active', fakeAsync(() => {
    mockErrors$.next([testError]);
    tick(10);
    mockErrors$.next([testError, testError]);
    tick(20);
    mockErrors$.next([testError, testError, , testError]);
    expect(mockBanner.addMessage).toHaveBeenCalledTimes(1);
  }));

  it('should cancel message when errors are cleared', fakeAsync(() => {
    mockErrors$.next([testError]);
    tick(10);
    expect(mockBanner.cancelMessage).not.toHaveBeenCalled();
    mockErrors$.next([]);
    expect(mockBanner.cancelMessage).toHaveBeenCalledTimes(1);
  }));

  it('should resend message to banner when message has been cancelled but another error came in', fakeAsync(() => {
    mockErrors$.next([testError]);
    tick(10);
    mockBanner.hasMessage.and.returnValue(false);
    mockErrors$.next([testError, testError]);
    expect(mockBanner.addMessage).toHaveBeenCalledTimes(2);
  }));

  it('should send new message after errors cleared but new error came in again', fakeAsync(() => {
    mockErrors$.next([testError]);
    tick(10);
    mockErrors$.next([]);
    tick(10);
    mockBanner.addMessage.calls.reset();
    mockErrors$.next([testError]);
    expect(mockBanner.addMessage).toHaveBeenCalledTimes(1);
  }));
});
