import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  createAccountInput,
  CreateAccountOutput,
} from 'src/users/dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UserService } from './users.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}
  @Query((returns) => Boolean)
  hi() {
    return true;
  }

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: createAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const [ok, error] = await this.usersService.createAccount(createAccountInput);
      return {
        ok, 
        error
      };
    } catch (e) {
      console.log(e);
      return {
        error: e,
        ok: false,
      };
    }
  }


  @Mutation(returns => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise <LoginOutput> {
    try {
       return await this.usersService.login(loginInput);
    } catch (error) {
       return {
        ok: false,
        error
       }
  }}
}
