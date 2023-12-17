import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PageResponse {
  @ApiProperty({ required: true })
  @Expose()
  id: number;

  @ApiProperty({ required: true })
  @Expose()
  userId: number;

  @ApiProperty({ required: true })
  @Expose()
  title: string;

  @ApiProperty({ required: true })
  @Expose()
  slug: string;

  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  constructor(partial?: Partial<PageResponse>) {
    Object.assign(this, partial);
  }
}
