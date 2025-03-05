import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  message: string | object;

  @ApiProperty()
  stack: string;

  @ApiProperty({ required: false })
  prismaCode?: string;

  @ApiProperty({ required: false })
  statusDescription?: string;
}
