import {Injectable, NestMiddleware, Logger, ForbiddenException, HttpStatus} from '@nestjs/common';
import { Request, Response } from "express";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: () => void) {
    const ipHost = this.configService.get('HOST') + ':' + this.configService.get('PORT_FRONT')
    const temp = this.configService.get('HOST') + ':1234' //TODO remove

    const {headers, method, originalUrl: url} = req;
    if (headers["origin"] !== ipHost && headers['origin'] !== temp && req.ip !== "::ffff:127.0.0.1" &&
        req.ip !== "::1") /*Postman*/ {
      res.statusCode = HttpStatus.FORBIDDEN
    }
    res.on('close', () => {
      const {statusCode} = res;

      this.logger.log(`${method} ${url} ${statusCode} - ${headers["origin"]}`)
    });

    if (res.statusCode === HttpStatus.FORBIDDEN) /*Postman*/ {
      throw new ForbiddenException()
    }

    next();
  }
}
