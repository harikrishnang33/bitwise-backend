import { AbstractEntity } from 'src/Common/Models/abstractEntity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GoogleDoc extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: true })
  public googleId: string;

  @Column({ nullable: false })
  public workspaceId: string;

}
