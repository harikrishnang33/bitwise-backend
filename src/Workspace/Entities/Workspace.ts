import { AbstractEntity } from 'src/Common/Models/abstractEntity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../User/Entities/User';
import { WorkspaceUsers } from './WorkspaceUsers';

@Entity()
export class Workspace extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: true })
  @Index('idx_workspace_name', {
    unique: true,
    where: `"deleted_at" IS NULL`,
  })
  public name!: string;

  @Column()
  public description!: string;

  @Column({ nullable: false })
  public adminUserId: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ referencedColumnName: 'id', name: 'admin_user_id' })
  public admin!: User;

  @OneToMany(
    () => WorkspaceUsers,
    (workspaceUsers) => workspaceUsers.workspace,
    {
      createForeignKeyConstraints: false,
    },
  )
  public workspaceUsers!: WorkspaceUsers[];
}
