import { LinkedNodeType } from 'src/LinkedNodes/Enums/LinkedNodeType';

export interface LinkedNodeModel {
  id: string;
  name: string;
  type: LinkedNodeType;
}
