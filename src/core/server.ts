import { createServer, IncomingMessage, ServerResponse } from "http";
import "reflect-metadata";
import { bodyParser } from "../middleware/bodyParser";
import { cookieParser } from "../middleware/cookieParser";
import { session } from "../middleware/session";
import {
  CookieOptions,
  Middleware,
  RequestWithCookies,
  ResponseWithCookies,
} from "../types";
import { Router } from "./router";

interface ServerOptions {
  useBodyParser?: boolean;
  useCookieParser?: boolean;
  useSession?: boolean;
  sessionOptions?: { secret: string; cookieName?: string };
}

export class Server {
  private router: Router;
  private middlewares: Middleware[] = [];

  constructor(options: ServerOptions = {}) {
    this.router = new Router();

    if (options.useBodyParser) {
      this.use(bodyParser);
    }

    if (options.useCookieParser) {
      this.use(cookieParser);
    }

    if (options.useSession) {
      this.use(session(options.sessionOptions || { secret: "default_secret" }));
    }
  }

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  registerController(controller: any) {
    this.router.register(controller);
  }

  listen(port: number, callback?: () => void) {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      const reqWithCookies = req as RequestWithCookies;
      const resWithCookies = res as ResponseWithCookies;

      resWithCookies.setCookie = (
        name: string,
        value: string,
        options: CookieOptions = {}
      ) => {
        let cookie = `${name}=${encodeURIComponent(value)}`;
        if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
        if (options.path) cookie += `; Path=${options.path}`;
        if (options.domain) cookie += `; Domain=${options.domain}`;
        if (options.secure) cookie += `; Secure`;
        if (options.httpOnly) cookie += `; HttpOnly`;
        res.setHeader("Set-Cookie", cookie);
      };

      resWithCookies.status = function (statusCode: number) {
        this.statusCode = statusCode;
        return this;
      };

      resWithCookies.send = function (body: string | Buffer) {
        this.writeHead(this.statusCode || 200, {
          "Content-Type": "text/plain",
        });
        this.end(body);
      };

      resWithCookies.json = function (body: any) {
        this.writeHead(this.statusCode || 200, {
          "Content-Type": "application/json",
        });
        this.end(JSON.stringify(body));
      };

      let idx = 0;

      const next = () => {
        if (idx < this.middlewares.length) {
          const middleware = this.middlewares[idx++];
          middleware(reqWithCookies, resWithCookies, next);
        } else {
          this.router.handle(reqWithCookies, resWithCookies);
        }
      };

      next();
    });

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      if (callback) callback();
    });
  }
}
