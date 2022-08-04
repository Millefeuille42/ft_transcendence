import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response } from "express";
import path from "path";

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: () => void) {
    const {ip, method, path: url} = req;

    res.on('close', () => {
      const {statusCode} = res;
      const contentLength = res.get('content-length')

      this.logger.log(`${method} ${url} ${statusCode} ${contentLength} - ${ip}`)
    });

    next();
  }
}
