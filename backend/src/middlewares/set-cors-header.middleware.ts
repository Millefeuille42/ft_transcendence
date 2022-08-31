import { Injectable, NestMiddleware } from '@nestjs/common';
import {Request, Response} from 'express';

@Injectable()
export class SetCorsHeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    res.set('Access-Control-Allow-Origin', req.headers["origin"])
    res.set('Access-Control-Allow-Methods', ["PATCH, DELETE"])
    res.set('Access-Control-Allow-Credentials', "true")
    res.set('Access-Control-Allow-Headers', "content-type")
    if (req.method === "OPTIONS") {
      res.send()
      return ;
    }
    next();
  }
}
