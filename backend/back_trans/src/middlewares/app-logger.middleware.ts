import {Injectable, NestMiddleware, Logger, ForbiddenException, HttpException, HttpStatus} from '@nestjs/common';
import { Request, Response } from "express";

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: () => void) {
    const {headers, method, originalUrl: url} = req;
    //::ffff:10.11.12.1
    if (headers["origin"] !== 'http://e1r11p2:8080' && req.ip !== "::ffff:127.0.0.1" &&
        req.ip !== "::1") /*Postman*/ {
      res.statusCode = HttpStatus.FORBIDDEN
    }
    res.on('close', () => {
      const {statusCode} = res;

      this.logger.log(`${method} ${url} ${statusCode} - ${headers["origin"]}`)
    });

    if (headers["origin"] !== 'http://e1r11p2:8080' && req.ip !== "::ffff:127.0.0.1" &&
        req.ip !== "::1") /*Postman*/ {
      res.statusCode = HttpStatus.FORBIDDEN
      throw new ForbiddenException()
    }

    next();
  }
}
