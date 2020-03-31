import { UrlUtils } from './url-utils';

import { UrlParts } from "../models/url-parts.interface";

describe('Test Api Utilities', () => {
  it('should create a proper URL from parts', () => {
    const testUrl: UrlParts = {
      protocol: "http",
      domainName: "test.com",
      port: 1234,
      path: "api"
    }
    expect(UrlUtils.createUrlFromParts(testUrl)).toBe("http://test.com:1234/api");
  });
  
  it('should create a proper URL from parts w/out port', () => {
    const testUrl: UrlParts = {
      protocol: "http",
      domainName: "test.com",
      path: "api"
    }
    expect(UrlUtils.createUrlFromParts(testUrl)).toBe("http://test.com/api");
  });
  
  it('should create a proper URL from parts w/out path', () => {
    const testUrl: UrlParts = {
      protocol: "http",
      domainName: "test.com",
      port: 1234
    }
    expect(UrlUtils.createUrlFromParts(testUrl)).toBe("http://test.com:1234");
  });

  it('should remove leading "/" from path when creating URL from parts', () => {
    const testUrl: UrlParts = {
      protocol: "http",
      domainName: "test.com",
      port: 1234,
      path: "/api"
    }
    expect(UrlUtils.createUrlFromParts(testUrl)).toBe("http://test.com:1234/api");
  });

  it('should append path to url', () => {
    const testUrl: string = "http://test.com:1234/api";
    const path: string = "users"
    expect(UrlUtils.appendPathToUrl(testUrl, path)).toBe("http://test.com:1234/api/users");
  });

  it('should remove leading "/" from path when appending path to url', () => {
    const testUrl: string = "http://test.com:1234/api";
    const path: string = "/users"
    expect(UrlUtils.appendPathToUrl(testUrl, path)).toBe("http://test.com:1234/api/users");
  });  

  it('should remove trailing "/" from url when appending path to url', () => {
    const testUrl: string = "http://test.com:1234/api/";
    const path: string = "users"
    expect(UrlUtils.appendPathToUrl(testUrl, path)).toBe("http://test.com:1234/api/users");
  });
});
