import { AbstractEntity } from 'src/Common/Models/abstractEntity';
import { GoogleTokenModel } from 'src/Google/Models/GoogleTokenModel';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  public googleTokenData: GoogleTokenModel;
}
