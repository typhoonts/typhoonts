import { Middleware } from "../types";

export const bodyParser: Middleware = (req, res, next) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      req.body = JSON.parse(body);
    } catch (err) {
      req.body = body;
    }
    next();
  });
};
