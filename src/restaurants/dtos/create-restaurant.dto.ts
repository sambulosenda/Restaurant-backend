import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { string } from 'joi';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
  'name',
  'coverImage',
  'address',
]) {
  @Field(type => String)
  categoryName: string
}

@ObjectType()
export class CreateRestaurantOutput extends MutationOutput {}
