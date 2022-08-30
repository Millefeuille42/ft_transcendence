import {ForbiddenException, HttpException, HttpStatus, Injectable, NestMiddleware} from '@nestjs/common';
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
    const redir: string = this.configService.get<string>('HOST') + ':' + this.configService.get<string>('PORT');
    const login: string = req.cookies['Session'];
    if (req.ip === "::ffff:127.0.0.1" || req.ip === "::1") {
      console.log("from localhost")
      next();
      return ;
    }
    console.log(login)
    if (!login) {
      console.log("No login")
      res.statusCode = 401
      throw new HttpException("User not logged", 401) ;
    }
    const token: string = this.userService.getToken(login);
    if (!token) {
      console.log('Pas dans la base de donnee')
      res.statusCode = 401
      throw new HttpException("User not logged", 401) ;
    }
    const ret: boolean = await this.meRequest(token);
    if (!ret) {
      console.log(ret)
      console.log('Token qui fonctionne pas')
      res.statusCode = 401
      throw new HttpException("User not logged", 401) ;
    }
    next();
  }
}
