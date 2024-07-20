import { Middleware } from "../types";

export const cookieParser: Middleware = (req, res, next) => {
  const cookieHeader = req.headers.cookie;
  req.cookies = {};

  if (cookieHeader) {
    const cookies = cookieHeader.split(";");
    cookies.forEach((cookie) => {
      const [name, value] = cookie.split("=");
      req.cookies[name.trim()] = decodeURIComponent(value);
    });
  }

  res.setCookie = (name: string, value: string, options: any = {}) => {
    let cookie = `${name}=${encodeURIComponent(value)}`;
    if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
    if (options.path) cookie += `; Path=${options.path}`;
    if (options.domain) cookie += `; Domain=${options.domain}`;
    if (options.secure) cookie += `; Secure`;
    if (options.httpOnly) cookie += `; HttpOnly`;
    res.setHeader("Set-Cookie", cookie);
  };

  next();
};
