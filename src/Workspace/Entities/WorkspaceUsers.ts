import { User } from 'src/User/Entities/User';
import { AbstractEntity } from '../../Common/Models/abstractEntity';
import { PrimaryColumn, Entity, ManyToOne } from 'typeorm';

@Entity()
export class WorkspaceUsers extends AbstractEntity {
  @PrimaryColumn({ nullable: false })
  public userId: string;

  @PrimaryColumn({ nullable: false })
  public workspaceId: string;

  @ManyToOne(() => User, (user) => user.workspaceUsers, {
    createForeignKeyConstraints: false,
  })
  public user!: User;
}
