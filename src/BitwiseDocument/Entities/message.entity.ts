import { AbstractEntity } from '../../Common/Models/abstractEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: true })
  public name: string;

  @Column({ nullable: true, type: 'text' })
  public message: string;

  @Column({ nullable: false })
  public workspaceId: string;

  @Column({ nullable: false })
  public ownerId: string;
}
