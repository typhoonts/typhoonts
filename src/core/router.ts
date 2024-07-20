import { parse } from "url";
import { RequestWithCookies, ResponseWithCookies } from "../types";

interface Route {
  method: string;
  path: string;
  handler: (req: RequestWithCookies, res: ResponseWithCookies) => void;
}

export class Router {
  private routes: Route[] = [];

  // Register controller and extract metadata
  register(controller: any) {
    const instance = new controller();
    const basePath = Reflect.getMetadata("basePath", controller);

    Object.getOwnPropertyNames(controller.prototype).forEach((methodName) => {
      const method = Reflect.getMetadata(
        "method",
        controller.prototype,
        methodName
      );
      const path = Reflect.getMetadata(
        "path",
        controller.prototype,
        methodName
      );
      if (method && path) {
        this.routes.push({
          method,
          path: `${basePath}${path}`,
          handler: (req: RequestWithCookies, res: ResponseWithCookies) => {
            instance[methodName].bind(instance)(req, res);
          },
        });
      }
    });
  }

  // Handle incoming requests
  handle(req: RequestWithCookies, res: ResponseWithCookies) {
    const url = parse(req.url || "", true);
    const method = req.method?.toLowerCase();
    const matchingRoute = this.routes.find((route) =>
      this.matchRoute(route, url.pathname!, method)
    );

    if (matchingRoute) {
      const params = this.extractParams(matchingRoute.path, url.pathname!);
      req.params = params;
      matchingRoute.handler(req, res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  }

  // Match route path and method
  private matchRoute(
    route: Route,
    pathname: string,
    method: string | undefined
  ): boolean {
    if (route.method !== method) return false;
    const routeSegments = route.path.split("/").filter(Boolean);
    const pathSegments = pathname.split("/").filter(Boolean);
    if (routeSegments.length !== pathSegments.length) return false;

    return routeSegments.every((segment, index) => {
      return segment.startsWith(":") || segment === pathSegments[index];
    });
  }

  // Extract parameters from route
  private extractParams(
    routePath: string,
    pathname: string
  ): { [key: string]: string } {
    const params: { [key: string]: string } = {};
    const routeSegments = routePath.split("/").filter(Boolean);
    const pathSegments = pathname.split("/").filter(Boolean);

    routeSegments.forEach((segment, index) => {
      if (segment.startsWith(":")) {
        const paramName = segment.slice(1);
        params[paramName] = pathSegments[index];
      }
    });

    return params;
  }
}
