import { IsEnum } from 'class-validator';
import { TicketStatus } from '../Enums/TicketStatusEnum';

export class UpdateTicketStatusDto {
  @IsEnum(TicketStatus)
  status!: TicketStatus;
}
