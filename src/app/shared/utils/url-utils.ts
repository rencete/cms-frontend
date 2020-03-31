import { UrlParts } from "../models/url-parts.interface";

export class UrlUtils {
  static createUrlFromParts(url: UrlParts): string {
    const port = url.port ? ":" + url.port : "";
    const path = (url.path || "").replace(/^\/+/, "");
    return `${url.protocol}://${url.domainName}${port}${path && "/" + path}`;
  };

  static appendPathToUrl(url: string, path: string): string {
    return url.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "")
  }
}
