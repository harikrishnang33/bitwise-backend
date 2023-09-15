import { LinkedNodeDto } from './linked-node.dto';

export class UpdateMessageDto {
  id: string;
  message: string;
  linkedNodes: LinkedNodeDto[];
}
