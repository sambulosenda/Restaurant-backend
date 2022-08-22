import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import * as JWT from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly configService: ConfigService, 
    private readonly jtwService: JwtService,
  ) {

  }
  async  createAccount({
    email,
    password,
    role,
  }: createAccountInput): Promise<[boolean, string?, string?]> {
    try {
      const exits = await this.users.findOne({ where: { email } });
      if (exits) {
        return [false, 'There is a user with that email'];
      }
      await this.users.save(this.users.create({ email, password, role }));
      return [true];
    } catch (e) {
      return [false, 'Could not react an account'];
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    //Find the user with the email
    try {
      const user = await this.users.findOne({ where: { email } });
      if (!user) {
        return {
          ok: false,
          error: 'User is not found',
        };
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'wrong Password',
        };
      }

      const token = JWT.sign({id: user.id}, this.configService.get('SECRET_KEY'))
      return {
        ok: true,
        token,
      };
    } catch (error) {
      console.log(error);
      return;
    }
  }
}
