import { IncomingMessage as Request, ServerResponse as Response } from "http";

export interface RequestWithBody extends Request {
  body: any;
  params: any;
}

export interface RequestWithCookies extends RequestWithBody {
  cookies: { [key: string]: string };
  session?: { [key: string]: any };
}

export interface ResponseWithCookies extends Response {
  setCookie: (name: string, value: string, options?: CookieOptions) => void;
}

export interface CookieOptions {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
}

export type Middleware = (
  req: RequestWithCookies,
  res: ResponseWithCookies,
  next: () => void
) => void;

export { Request, Response };
