import { Activity } from 'src/activities/entities/activity.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true, nullable: false })
  username: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'text', unique: true, nullable: false })
  email: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'text', nullable: false })
  first_name: string;

  @Column({ type: 'text', nullable: false })
  last_name: string;

  @Column({ type: 'date', nullable: false })
  created_at: Date;

  @Column({ type: 'date', nullable: true })
  updated_at: Date;

  @OneToMany(()=>Activity,(activity)=>activity.user)
  activity:Activity[]

  @BeforeInsert()
  onCreate() {
    this.created_at = new Date();
  }

  @BeforeUpdate()
  onUpdate() {
    this.updated_at = new Date();
  }
}
