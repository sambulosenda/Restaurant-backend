import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import * as JWT from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
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

      const token = this.jtwService.sign(user.id)
      return {
        ok: true,
        token,
      };
    } catch (error) {
       return{
        ok: false, 
        error
       }
    }
  }

  async findById(id:number): Promise<User> {
    return this.users.findOne({where: {id}})
  }

  async editProfile(id: number, {email, password}: EditProfileInput) {
    const user = await this.users.findOne({ where: {id} });
    if(email){
      user.email = email
    }
    if(password){
      user.password = password
    }
    return this.users.save(user)

  }
}
