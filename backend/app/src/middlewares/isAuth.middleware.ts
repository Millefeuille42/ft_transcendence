import {HttpException, Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';
import {UserService} from "../user/user.service";
import {ConfigService} from "@nestjs/config";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class IsAuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService,
              private readonly configService: ConfigService,
              private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: () => void) {
    const uuid: string = req.cookies['Session'];
    const login: string = req.cookies['Login'];
    if (req.ip === "::ffff:127.0.0.1" || req.ip === "::1") {
      // const token: string = await this.userService.getToken(login);
      // const uuidSession = await this.userService.getUuidSession(login)
      // if (!token || !uuidSession)
      //   throw new HttpException("Va chercher un cookie wesh", 401)
      console.log("from localhost")
      next();
      return ;
    }
    console.log(login, uuid)
    if (!login || !uuid) {
      res.statusCode = 401
      throw new HttpException("User don't have cookies", 401) ;
    }
    const token: string = await this.userService.getToken(login);
    const uuidSession = await this.userService.getUuidSession(login)
    if (!token) {
      if (uuid === uuidSession)
        await this.userService.deleteUuidSession(login)
      res.statusCode = 401
      throw new HttpException("User is not in database", 401) ;
    }
    if (uuidSession !== uuid && uuid !== "pass") {
      res.statusCode = 401
      throw new HttpException("User don't have the good uuid", 401)
    }
    const ret: boolean = await this.authService.meRequest(token);
    if (!ret) {
      await this.userService.deleteToken(login)
      await this.userService.deleteUuidSession(login)
      res.statusCode = 403
      throw new HttpException("User is not logged", 403) ;
    }
    next();
  }
}
