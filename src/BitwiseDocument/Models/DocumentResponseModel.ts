import { LinkedNodeModel } from './LinkedNodeModel';

export interface DocumentResponseModel {
  id: string;
  name: string;
  message: string;
  workspaceId: string;
  ownerId: string;
  linkedNodes: LinkedNodeModel[];
}
