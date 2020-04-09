import { TestBed } from '@angular/core/testing';

import { RestApiUrlService } from './rest-api-url.service';
import { UrlParts } from "@shared/models/url-parts.interface";
import { API_URL_TOKEN } from '@app/core/services/api-url.token';

describe('Test URL path utilities', () => {
  let service: RestApiUrlService;

  it('should create a proper URL from parts', () => {
    const testUrl: UrlParts = {
      protocol: "http",
      hostname: "test.com",
      port: 1234,
      pathname: "api"
    };
    prepareTestbed(testUrl);

    expect(service.restApiBaseUrl).toBe("http://test.com:1234/api");
  });

  function prepareTestbed(urlParts: UrlParts) {
    TestBed.configureTestingModule({
      providers: [
        { provide: API_URL_TOKEN, useValue: urlParts }
      ]
    });
    service = TestBed.inject(RestApiUrlService);
  }
  
  it('should create a proper URL from parts w/out port', () => {
    const testUrl: UrlParts = {
      protocol: "http",
      hostname: "test.com",
      pathname: "api"
    };
    prepareTestbed(testUrl);

    expect(service.restApiBaseUrl).toBe("http://test.com/api");
  });
  
  it('should create a proper URL from parts w/out path', () => {
    const testUrl: UrlParts = {
      protocol: "http",
      hostname: "test.com",
      port: 1234
    };
    prepareTestbed(testUrl);

    expect(service.restApiBaseUrl).toBe("http://test.com:1234");
  });

  it('should remove trailing ":" from protocol when creating URL from parts', () => {
    const testUrl: UrlParts = {
      protocol: "http:",
      hostname: "test.com",
      port: 1234,
      pathname: "api"
    };
    prepareTestbed(testUrl);

    expect(service.restApiBaseUrl).toBe("http://test.com:1234/api");
  });

  it('should remove leading "/" from path when creating URL from parts', () => {
    const testUrl: UrlParts = {
      protocol: "http",
      hostname: "test.com",
      port: 1234,
      pathname: "/api"
    };
    prepareTestbed(testUrl);

    expect(service.restApiBaseUrl).toBe("http://test.com:1234/api");
  });

  it('should append path to url', () => {
    const testUrl: UrlParts = {
      protocol: "http:",
      hostname: "test.com",
      port: 1234,
      pathname: "api"
    };
    const basePath: string = "users"
    prepareTestbed(testUrl);
    
    expect(service.createRestApiUrl(basePath)).toBe("http://test.com:1234/api/users");
  });

  it('should append multiple paths path to url', () => {
    const testUrl: UrlParts = {
      protocol: "http:",
      hostname: "test.com",
      port: 1234,
      pathname: "a"
    };
    const pathb: string = "b"
    const pathc: string = "c"
    const pathd: string = "d"
    prepareTestbed(testUrl);

    expect(service.createRestApiUrl(pathb, pathc, pathd)).toBe("http://test.com:1234/a/b/c/d");
  });

  it('should remove leading "/" from path when appending path to url', () => {
    const testUrl: UrlParts = {
      protocol: "http:",
      hostname: "test.com",
      port: 1234,
      pathname: "api"
    };
    const basePath: string = "/users"
    prepareTestbed(testUrl);

    expect(service.createRestApiUrl(basePath)).toBe("http://test.com:1234/api/users");
  });  

  it('should remove trailing "/" from url when appending path to url', () => {
    const testUrl: UrlParts = {
      protocol: "http:",
      hostname: "test.com",
      port: 1234,
      pathname: "api/"
    };
    const basePath: string = "users"
    prepareTestbed(testUrl);

    expect(service.createRestApiUrl(basePath)).toBe("http://test.com:1234/api/users");
  });

  it('should accept empty string path when appending path to url', () => {
    const testUrl: UrlParts = {
      protocol: "http:",
      hostname: "test.com",
      port: 1234,
      pathname: "api"
    };
    const basePath: string = "";
    prepareTestbed(testUrl);

    expect(service.createRestApiUrl(basePath)).toBe("http://test.com:1234/api");
  });

  it('should accept empty string paths when appending multiple paths to url', () => {
    const testUrl: UrlParts = {
      protocol: "http:",
      hostname: "test.com",
      port: 1234,
      pathname: "api"
    };
    const basePath: string[] = ["a", "", "b", "", "c", ""];
    prepareTestbed(testUrl);

    expect(service.createRestApiUrl(...basePath)).toBe("http://test.com:1234/api/a/b/c");
  });

  it('should accept null string path when appending path to url', () => {
    const testUrl: UrlParts = {
      protocol: "http:",
      hostname: "test.com",
      port: 1234,
      pathname: "api"
    };
    const basePath: string = null;
    prepareTestbed(testUrl);

    expect(service.createRestApiUrl(basePath)).toBe("http://test.com:1234/api");
  });

  it('should accept null string paths when appending multiple paths to url', () => {
    const testUrl: UrlParts = {
      protocol: "http:",
      hostname: "test.com",
      port: 1234,
      pathname: "api"
    };
    const basePath: string[] = ["a", null, "b", null, "c", null];
    prepareTestbed(testUrl);

    expect(service.createRestApiUrl(...basePath)).toBe("http://test.com:1234/api/a/b/c");
  });
});
