import { AbstractEntity } from 'src/Common/Models/abstractEntity';
import { WorkspaceUsers } from 'src/Workspace/Entities/WorkspaceUsers';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Credentials } from 'google-auth-library';

@Entity()
export class User extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: true })
  public name: string;

  @Column()
  @Index('idx_user_email', {
    unique: true,
    where: `"deleted_at" IS NULL`,
  })
  public email!: string;

  @OneToMany(() => WorkspaceUsers, (workspaceUsers) => workspaceUsers.user, {
    createForeignKeyConstraints: false,
  })
  public workspaceUsers!: WorkspaceUsers[];

  @Column({type: 'json'})
  public googleTokenData: Credentials;
}
