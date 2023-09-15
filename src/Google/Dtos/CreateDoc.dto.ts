import { IsString } from 'class-validator';

export class CreateDocDto {
  @IsString()
  name: string;

  @IsString()
  workspaceId: string;
}
