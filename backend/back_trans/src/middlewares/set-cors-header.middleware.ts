import { Injectable, NestMiddleware } from '@nestjs/common';
import {Request, Response} from 'express';
//import {ConfigService} from "@nestjs/config";

@Injectable()
export class SetCorsHeaderMiddleware implements NestMiddleware {
  //constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: () => void) {
    //const ipHost = this.configService.get('HOST') + ':' + this.configService.get('PORT_FRONT')
    //console.log(req.headers)
    //res.set('Access-Control-Allow-Origin', ipHost)
    //res.set('Access-Control-Allow-Methods', ["PATCH, DELETE"])
    //res.set('Access-Control-Allow-Credentials', "true")
    //res.set('Access-Control-Allow-Headers', "content-type")
    //if (req.method === "OPTIONS") {
    //  res.send()
    //  return ;
    //}
    next();
  }
}
