import * as urljoin from "url-join";

import { UrlParts } from "../models/url-parts.interface";

export class UrlUtils {
  static createUrlFromParts(url: UrlParts): string {
    const protocol = url.protocol.replace(/:+/, "");
    const port = url.port ? ":" + url.port : "";
    const path = (url.pathname || "").replace(/^\/+/, "");
    return `${protocol}://${url.hostname}${port}${path && "/" + path}`;
  };

  static appendPathToUrl(...paths: string[]): string {
    return urljoin.apply(undefined, paths);
  }

  static generateRestApiUrl(urlParts: UrlParts, apiBasePath: string): string {
    const urlBase: string = UrlUtils.createUrlFromParts(urlParts);
    return UrlUtils.appendPathToUrl(urlBase, apiBasePath);
  }
}
