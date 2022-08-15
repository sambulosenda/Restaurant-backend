import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { createAccountInput, CreateAccountOutput } from 'src/users/dtos/create-account.dto';
import { User } from './entities/user.entity';
import { UserService } from './users.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Query(returns => Boolean)
  hi(){
    return true
  }

  @Mutation(returns => CreateAccountOutput)
  async createAccount(@Args("input") createAccountInput: createAccountInput ): Promise <CreateAccountOutput> {
    try {
        const error = await this.usersService.createAccount(createAccountInput)
        if(error) {
            return{
                ok: false, 
                error
            }
        }
        return {
            ok: true
        }

    }catch(e) {
        console.log(e)
        return{
            error: e,
            ok: false,
        }
    }

  }





}
