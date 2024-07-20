import { v4 as uuidv4 } from "uuid";
import { Middleware } from "../types";

const sessionStore: { [key: string]: any } = {};

export const session = (
  options: { secret: string; cookieName?: string } = {
    secret: "default_secret",
    cookieName: "sid",
  }
): Middleware => {
  const cookieName = options.cookieName || "sid";

  return (req, res, next) => {
    let sessionId = req.cookies ? req.cookies[cookieName] : undefined;

    if (!sessionId || !sessionStore[sessionId]) {
      sessionId = uuidv4();
      sessionStore[sessionId] = {};
    }

    req.session = sessionStore[sessionId];

    res.setCookie(cookieName, sessionId, { httpOnly: true });

    next();
  };
};
