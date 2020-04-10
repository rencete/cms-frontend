import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import * as urljoin from "url-join";

import { RemoteLoggingService } from './remote-logging.service';
import { RestApiUrlService } from '@core/services/rest-api-url/rest-api-url.service';

describe('RemoteLoggingService', () => {
  let service: RemoteLoggingService;
  let apiUrlBase: string = "http://sub.main.domain:1234/a";
  let httpClientMock: HttpClient;

  describe('Success tests', () => {
    beforeEach(() => {
      const httpMock = createHttpClientMock(of({ }));
      const urlMock = createApiUrlServiceMock();
      prepareTestBed(httpMock, urlMock);
    });

    it('should not send anything at start', () => {
      expect(service).toBeTruthy();
      expect(httpClientMock.post).not.toHaveBeenCalled();
    });

    it('should send obj to remote log API using post', () => {
      const testObj: any = { msg: "test" };
      service.remoteLog(testObj).subscribe(() => { });

      expect(httpClientMock.post).toHaveBeenCalledTimes(1);
    });
  });

  function createHttpClientMock(returnObs: Observable<any>): { post: jasmine.Spy } {
    let httpMock = jasmine.createSpyObj('HttpClient', ['post']);
    httpMock.post.and.callFake((p, obj) => {
      expect(p).toBe(`${apiUrlBase}/${RemoteLoggingService.REMOTE_LOGGING_URL_BASE_PATH}`);
      return returnObs;
    });
    return httpMock;
  }

  function createApiUrlServiceMock(): { createRestApiUrl: jasmine.Spy } {
    let mockApiUrlService = jasmine.createSpyObj('RestApiUrlService', ["createRestApiUrl"]);
    mockApiUrlService.createRestApiUrl.and.callFake((base: string = "", path: string = "") => {
      return urljoin(apiUrlBase, base, path);
    });
    return mockApiUrlService;
  }

  function prepareTestBed(
    httpMock: { post: jasmine.Spy<InferableFunction>; },
    urlMock: { createRestApiUrl: jasmine.Spy<InferableFunction>; }
  ) {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpMock },
        { provide: RestApiUrlService, useValue: urlMock }
      ]
    });
    service = TestBed.inject(RemoteLoggingService);
    httpClientMock = TestBed.inject(HttpClient);
    return { service, httpClientMock };
  }

  describe('Error tests', () => {
    let spyFunc: jasmine.Spy;

    beforeEach(() => {
      spyFunc = jasmine.createSpy();
      const errorObs = new Observable<any>(subscriber => {
        spyFunc();
        subscriber.error({});
      });

      const httpMock = createHttpClientMock(errorObs);
      const urlMock = createApiUrlServiceMock();
      prepareTestBed(httpMock, urlMock);

    })

    it("Should detect an error during POST", () => {
      const testObj: any = { msg: "test" };
      service.remoteLog(testObj).subscribe(
        () => { fail() },
        (err) => { expect(httpClientMock.post).toHaveBeenCalled() }
      );
    });

    it("Should retry 3 additional times for errors", () => {
      const testObj: any = { msg: "test" };
      service.remoteLog(testObj).subscribe(
        () => { fail() },
        (err) => { expect(spyFunc).toHaveBeenCalledTimes(1 + 3) }
      );
    });
  });
});