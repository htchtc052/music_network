import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Genders, User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty({ required: true })
  @Expose()
  id: number;

  @ApiProperty({ required: true })
  @Expose()
  username: string;

  @ApiProperty({ required: true })
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  gender: Genders;

  @Exclude()
  activationToken: string;

  @Exclude()
  ativatedAt: Date | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  isAdmin: boolean;

  @Exclude()
  password: string;

  constructor(partial?: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
