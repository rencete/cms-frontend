import { TestBed } from '@angular/core/testing';

import { GlobalErrorHandlerService } from './global-error-handler.service';
import { ErrorFacade } from '@app/error/services/error-facade.service';

describe('GlobalErrorHandlerService', () => {
  let service: GlobalErrorHandlerService;
  let testError: Error;
  let mockFacade: {
    handleError: jasmine.Spy
  };

  describe("Success tests", () => {
    beforeEach(() => {
      testError = new Error("test");
      const facadeMock = jasmine.createSpyObj("ErrorFacade", ["handleError"]);
      TestBed.configureTestingModule({
        providers: [
          { provide: ErrorFacade, useValue: facadeMock }
        ]
      });
      service = TestBed.inject(GlobalErrorHandlerService);
    });

    beforeEach(() => {
      spyOn(console, "error");
      mockFacade = TestBed.get(ErrorFacade);
    });

    it('should log the error to console', () => {
      service.handleError(testError);

      expect(console.error).toHaveBeenCalledWith(testError);
    });

    it('should forward to error facade for further operations', () => {
      service.handleError(testError);

      expect(mockFacade.handleError).toHaveBeenCalledWith(testError);
    });
  });
});
