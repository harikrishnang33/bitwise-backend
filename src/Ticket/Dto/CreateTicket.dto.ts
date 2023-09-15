import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsString()
  createdBy!: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  workspaceId: string;
}
