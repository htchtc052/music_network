import { Genders } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class UserResponse {
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
  firstName?: string;

  @ApiProperty()
  @Expose()
  lastName?: string;

  @ApiProperty()
  @Expose()
  gender?: Genders;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  emailConfirmedAt: Date;

  @Exclude()
  password: string;

  constructor(partial?: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
