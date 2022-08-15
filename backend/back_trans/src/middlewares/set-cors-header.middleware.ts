import { Injectable, NestMiddleware } from '@nestjs/common';
import {Request, Response} from 'express';

@Injectable()
export class SetCorsHeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log('coucou le middleware cors')
    res.set('Access-Control-Allow-Origin', req.headers["origin"])
    res.set('Access-Control-Allow-Credentials', "true")
    next();
  }
}
