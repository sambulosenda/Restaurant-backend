import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import {
  createAccountInput,
  CreateAccountOutput,
} from 'src/users/dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
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
      const {ok, error} = await this.usersService.createAccount(
        createAccountInput,
      );
      return {
        ok,
        error,
      };
    } catch (e) {
      console.log(e);
      return {
        error: e,
        ok: false,
      };
    }
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return await this.usersService.login(loginInput);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Query((returns) => User)
  @Role(["Any"])
  me(@AuthUser() AuthUser: User) {
    return AuthUser;
  }

  @Role(["Any"])
  @Query((returns) => UserProfileOutput)
  async userProfile(
    @Args() userprofileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    try {
      const user = await this.usersService.findById(userprofileInput.userId);
      if (!user) {
        throw Error();
      }
      return {
        ok: true,
        user,
      };
    } catch (e) {
      return {
        error: 'User Not Found',
        ok: false,
      };
    }
  }


  @Mutation((returns) => EditProfileOutput)
  @Role(["Any"])
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
 
  ): Promise<EditProfileOutput> {
    try {
      await this.usersService.editProfile(authUser.id, editProfileInput);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Mutation((returns) => VerifyEmailOutput)
  async verifyEmail(
    @Args('input') { code }: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    try {
      await this.usersService.verifyEmail(code);
      return {
        ok: true
      }
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
