import { AbstractEntity } from 'src/Common/Models/abstractEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TicketStatus } from '../Enums/TicketStatusEnum';
import { User } from 'src/User/Entities/User';

@Entity()
export class Ticket extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: false })
  public title!: string;

  @Column({ nullable: true })
  public description: string;

  @Column({ enum: TicketStatus, nullable: false })
  public status!: TicketStatus;

  @Column({ nullable: false })
  public createdById!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'created_by_id' })
  public createdBy!: User;
}
