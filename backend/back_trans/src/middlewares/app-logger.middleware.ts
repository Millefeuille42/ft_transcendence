import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response } from "express";

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: () => void) {
    const ip: string = req.ip
    const method: string = req.method
    const url: string = req.url


    res.on('close', () => {
      const statusCode = res.statusCode;
      const contentLength = res.get('content-length')

      this.logger.log(`${method} ${url} ${statusCode} ${contentLength} - ${ip}`)
    });

    next();
  }
}
