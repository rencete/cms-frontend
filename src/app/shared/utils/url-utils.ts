import * as urljoin from "url-join";

import { UrlParts } from "../models/url-parts.interface";

export class UrlUtils {
  static createUrlFromParts(url: UrlParts): string {
    const port = url.port ? ":" + url.port : "";
    const path = (url.path || "").replace(/^\/+/, "");
    return `${url.protocol}://${url.domainName}${port}${path && "/" + path}`;
  };

  static appendPathToUrl(...paths: string[]): string {
    return urljoin.apply(undefined, paths);
  }
}
