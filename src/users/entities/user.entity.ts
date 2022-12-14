import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { IsBoolean, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { BeforeInsert, Column, Entity, BeforeUpdate, OneToMany } from 'typeorm';

export enum UserRole {
  Client = "Client",
  Owner = "Owner",
  Delivery = "Delivery",
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType',{ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  email: string;

  @Column({ select: false})
  @Field((type) => String)
  @IsString()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  role: UserRole;

  @Column({ default: false})
  @Field(type => Boolean)
  @IsBoolean()
  verified: boolean


  @Field(type => [Restaurant])
  @OneToMany(type => Restaurant, restaurant => restaurant.owner)
  restaurants: Restaurant[];


  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password){
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error)
        throw new InternalServerErrorException()
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException()

    }
  }
}
