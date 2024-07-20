import { IncomingMessage as Request, ServerResponse as Response } from "http";

export interface RequestWithBody extends Request {
  body: any;
  params: any;
  query: any;
}

export interface RequestWithCookies extends RequestWithBody {
  cookies: { [key: string]: string };
  session?: { [key: string]: any };
}

export interface ResponseWithCookies extends Response {
  setCookie: (name: string, value: string, options?: CookieOptions) => void;
  status: (statusCode: number) => ResponseWithCookies;
  send: (body: string | Buffer) => void;
  json: (body: any) => void;
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
