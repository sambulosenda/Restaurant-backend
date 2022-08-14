import { Field, ObjectType } from '@nestjs/graphql';
import { type } from 'os';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Field((type) => String)
  @Column()
  name: string;

  @Field((type) => Boolean, { nullable: true })
  @Column()
  isGood?: boolean;

  @Field((type) => String)
  @Column()
  address: string;

  @Field((type) => String)
  @Column()
  ownerName: string;


  @Field((type) => String)
  @Column()
  catagoryName: string
}
