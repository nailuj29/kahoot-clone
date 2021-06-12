import { RequestHandler } from "express";
import { verifyToken } from "@kahoot-clone/auth";

export const requireAuth: RequestHandler = async (req, res, next) => {
  if (req.headers.authorization) {
    if (await verifyToken(req.headers.authorization)) {
      next();
    } else {
      res.status(401).json({ status: 401, message: "Unauthorized" });
    }
  } else {
    res.status(401).json({ status: 401, message: "Unauthorized" });
  }
}
