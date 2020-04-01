import { UrlUtils } from './url-utils';

import { UrlParts } from "../models/url-parts.interface";

describe('Test URL path utilities', () => {
  it('should create a proper URL from parts', () => {
    const testUrl: UrlParts = {
      protocol: "http",
      hostname: "test.com",
      port: 1234,
      pathname: "api"
    }
    expect(UrlUtils.createUrlFromParts(testUrl)).toBe("http://test.com:1234/api");
  });
  
  it('should create a proper URL from parts w/out port', () => {
    const testUrl: UrlParts = {
      protocol: "http",
      hostname: "test.com",
      pathname: "api"
    }
    expect(UrlUtils.createUrlFromParts(testUrl)).toBe("http://test.com/api");
  });
  
  it('should create a proper URL from parts w/out path', () => {
    const testUrl: UrlParts = {
      protocol: "http",
      hostname: "test.com",
      port: 1234
    }
    expect(UrlUtils.createUrlFromParts(testUrl)).toBe("http://test.com:1234");
  });

  it('should remove trailinn ":" from protocol when creating URL from parts', () => {
    const testUrl: UrlParts = {
      protocol: "http:",
      hostname: "test.com",
      port: 1234,
      pathname: "api"
    }
    expect(UrlUtils.createUrlFromParts(testUrl)).toBe("http://test.com:1234/api");
  });

  it('should remove leading "/" from path when creating URL from parts', () => {
    const testUrl: UrlParts = {
      protocol: "http",
      hostname: "test.com",
      port: 1234,
      pathname: "/api"
    }
    expect(UrlUtils.createUrlFromParts(testUrl)).toBe("http://test.com:1234/api");
  });

  it('should append path to url', () => {
    const testUrl: string = "http://test.com:1234/api";
    const path: string = "users"
    expect(UrlUtils.appendPathToUrl(testUrl, path)).toBe("http://test.com:1234/api/users");
  });

  it('should append multiple paths path to url', () => {
    const testUrl: string = "http://test.com:1234/a";
    const pathb: string = "b"
    const pathc: string = "c"
    const pathd: string = "d"
    expect(UrlUtils.appendPathToUrl(testUrl, pathb, pathc, pathd)).toBe("http://test.com:1234/a/b/c/d");
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
