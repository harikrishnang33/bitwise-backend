import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { LinkedNode } from '../Entities/LinkedNode';
import { LinkedNodeDto } from 'src/BitwiseDocument/dto/linked-node.dto';
import { isEmpty } from 'lodash';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LinkedNodeService {
  constructor(private readonly dataSource: DataSource) {}

  async insert(
    sourceId: string,
    workspaceId: string,
    linkedNodeDtoList: LinkedNodeDto[],
  ) {
    let linkedNodes: LinkedNode[] = [];
    if (!isEmpty(linkedNodeDtoList)) {
      linkedNodes = linkedNodeDtoList?.map((linkedNode: LinkedNode) =>
        plainToClass(LinkedNode, {
          sourceId,
          workspaceId,
          destinationId: linkedNode.destinationId,
          type: linkedNode.type,
        }),
      );
    }

    const savedLinkedNodes = await this.dataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const linkedNodeRepository =
          transactionalEntityManager.getRepository(LinkedNode);
        return linkedNodeRepository.save(linkedNodes);
      },
    );
    return savedLinkedNodes;
  }

  async getLinkedNodes(workspaceId: string, sourceId?: string) {
    const linkedNodes = await this.dataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const linkedNodeRepository =
          transactionalEntityManager.getRepository(LinkedNode);
        return linkedNodeRepository.findBy({
          ...(sourceId&&{sourceId}),
          workspaceId,
          deletedAt: null,
        });
      },
    );
    return linkedNodes;
  }

  async softDelete(sourceId: string) {
    await this.dataSource
      .getRepository(LinkedNode)
      .softDelete({ id: sourceId });
  }
}
