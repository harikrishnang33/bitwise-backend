import { AbstractEntity } from 'src/Common/Models/abstractEntity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({type: 'json'})
  public googleTokenData: Credentials;
}
