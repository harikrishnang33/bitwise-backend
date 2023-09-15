import { AbstractEntity } from 'src/Common/Models/abstractEntity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { LinkedNodeType } from '../Enums/LinkedNodeType';

@Entity()
// @Index('idx_source_id_destination_id', ['sourceId', 'destinationId'], { unique: true })
export class LinkedNode extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: false })
  public sourceId!: string;

  @Column({ nullable: false })
  public destinationId!: string;

  @Column({ nullable: false })
  public workspaceId!: string;

  @Column({ enum: LinkedNodeType, nullable: false })
  public type!: LinkedNodeType;
}
