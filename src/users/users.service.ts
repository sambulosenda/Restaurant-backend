import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { createAccountInput } from './dtos/create-account.dto';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jtwService: JwtService,
  ) {}
  async createAccount({
    email,
    password,
    role,
  }: createAccountInput): Promise<[boolean, string?, string?]> {
    try {
      const exits = await this.users.findOne({ where: { email } });
      if (exits) {
        return [false, 'There is a user with that email'];
      }
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );
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
      const user = await this.users.findOne({ where: { email }, select: ['id','password'] });
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

      const token = this.jtwService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findById(id: number): Promise<User> {
    return this.users.findOne({ where: { id } });
  }

  async editProfile(id: number, { email, password }: EditProfileInput) {
    const user = await this.users.findOne({ where: { id } });
    if (email) {
      user.email = email;
      user.verified = false;
      await this.verifications.save(this.verifications.create({ user }));
    }
    if (password) {
      user.password = password;
    }
    return this.users.save(user);
  }

  async verifyEmail(code: string): Promise<boolean> {
   try {
    const verification = await this.verifications.findOne({
      where: { code },
      relations: ['user'],
    });
    if (verification) {
      verification.user.verified = true;
      await this.users.save(verification.user);
      await this.verifications.delete(verification.id)
      return true 
    }
    return false;
   } catch (error) {
     console.log(error)
     return false
   }
  }
}
