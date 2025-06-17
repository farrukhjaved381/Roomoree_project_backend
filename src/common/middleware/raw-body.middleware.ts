import { Request, Response, NextFunction } from 'express';
import * as express from 'express';

export function rawBodyMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.originalUrl === '/payments/webhook') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
}
