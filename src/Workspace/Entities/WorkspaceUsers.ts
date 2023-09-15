import { User } from 'src/User/Entities/User';
import { AbstractEntity } from '../../Common/Models/abstractEntity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class WorkspaceUsers extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid')
  public userId: string;

  @Column('uuid')
  public workspaceId: string;

  @ManyToOne(() => User, (user) => user.workspaceUsers, {
    createForeignKeyConstraints: false,
  })
  public user!: User;
}
