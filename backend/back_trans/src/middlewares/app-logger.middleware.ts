import { Injectable, NestMiddleware, Logger, ForbiddenException} from '@nestjs/common';
import { Request, Response } from "express";

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: () => void) {
    const {headers, method, originalUrl: url} = req;

    res.on('close', () => {
      const {statusCode} = res;

      //if (headers["origin"] !== 'http://e1r12p1:8080')
        //throw new ForbiddenException();
      this.logger.log(`${method} ${url} ${statusCode} - ${headers["origin"]}`)
    });

    next();
  }
}
