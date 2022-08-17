import {Controller, Get} from '@nestjs/common';
import { AppService } from './app.service';

/**
 * This is a comment.
 */

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
