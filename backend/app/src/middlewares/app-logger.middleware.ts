import {Injectable, NestMiddleware, Logger, ForbiddenException, HttpStatus} from '@nestjs/common';
import { Request, Response } from "express";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: () => void) {
    const ipHost = this.configService.get('HOST') + ':' + this.configService.get('PORT_FRONT')

    const {headers, method, originalUrl: url} = req;
    if (headers["origin"] !== ipHost && req.ip !== "::ffff:127.0.0.1" &&
        req.ip !== "::1") /*Postman*/ {
      res.statusCode = HttpStatus.FORBIDDEN
    }
    res.on('close', () => {
      const {statusCode} = res;

      this.logger.log(`${method} ${url} ${statusCode} - ${headers["origin"]}`)
    });

    if (headers["origin"] !== ipHost && req.ip !== "::ffff:127.0.0.1" &&
        req.ip !== "::1") /*Postman*/ {
      res.statusCode = HttpStatus.FORBIDDEN
      throw new ForbiddenException()
    }

    next();
  }
}
