import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({ email, password, role }: createAccountInput) : Promise<string | undefined> {
    try {
      const exits = await this.users.findOne({where: {email }});
      if( exits ) {
        return "There is a user with that email"
      }
      await this.users.save(this.users.create({email, password, role}))
    } catch (e) {
      console.log(e);
      return 

    }
 
  }
}
