import { Handler } from 'express';
import { getToken, verifyToken } from '@kahoot-clone/auth';

export const requireAuth: Handler = async (req, res, next) => {
  if (!req.authenticated) {
    res.status(401).json({ status: 401, message: 'Not authorized' });
    return;
  }

  next();
};

export const authenticate: Handler = async (req, res, next) => {
  if (req.headers.authorization) {
    if (await verifyToken(req.headers.authorization)) {
      req.authenticated = true;
      req.id = (await getToken(req.headers.authorization).id) as string;
    } else {
      req.authenticated = false;
    }
  } else {
    req.authenticated = false;
  }

  next();
};
