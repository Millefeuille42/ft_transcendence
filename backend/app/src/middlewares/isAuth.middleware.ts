import {HttpException, Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';
import {UserService} from "../user/user.service";
import {ConfigService} from "@nestjs/config";
import axios from "axios";

@Injectable()
export class IsAuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService,
              private readonly configService: ConfigService) {}

  async meRequest(token: string) {
    const ret: boolean = await axios({
      method: "GET",
      url: this.configService.get<string>('API') + "/v2/me",
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "application/json",
      },
    })
        .then(() => {
           return true;
        })
        .catch(async (err) => {
          if (err.response.status == 429) {
            await new Promise(f => setTimeout(f, +err.response.headers['retry-after'] * 1000))
            return this.meRequest(token);
          }
          return false
        });
    return ret;
  }

  async use(req: Request, res: Response, next: () => void) {
    const uuid: string = req.cookies['Session'];
    const login: string = req.cookies['Login'];
    if (req.ip === "::ffff:127.0.0.1" || req.ip === "::1") {
      console.log("from localhost")
      next();
      return ;
    }
    console.log(login, uuid)

    if (!login || !uuid) {
      console.log("No cookie")
      res.statusCode = 401
      throw new HttpException("User don't have cookies", 401) ;
    }
    const token: string = await this.userService.getToken(login);
    const uuidSession = await this.userService.getUuidSession(login)
    if (!token) {
      console.log('Pas dans la base de données')
      if (uuid === uuidSession)
        await this.userService.deleteUuidSession(login)
      res.statusCode = 401
      throw new HttpException("User is not in database", 401) ;
    }
    if (uuidSession !== uuid) {
      console.log('Pas le même uuid')
      res.statusCode = 401
      throw new HttpException("User don't have the good uuid", 401)
    }

    const ret: boolean = await this.meRequest(token);
    if (!ret) {
      console.log(ret)
      console.log('Token qui fonctionne pas')
      await this.userService.deleteToken(login)
      await this.userService.deleteUuidSession(login)
      res.statusCode = 403
      throw new HttpException("User is not logged", 403) ;
    }
    console.log('patate')
    next();
  }
}
