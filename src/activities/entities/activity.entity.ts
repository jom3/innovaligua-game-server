import { ActivityType } from 'src/shared/types/activityType';
import { User } from 'src/users/entities/user.entity';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Activity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  userId: string;

  @Column({ type: 'enum', enum: ActivityType, default: ActivityType.SOUP })
  type: ActivityType;

  @Column({ type: 'int', default: 0 })
  max_score: number;

  @Column({ type: 'int', nullable: false })
  attempts: number;

  @Column({ type: 'int', default: 1 })
  state: number;

  @Column({ type: 'date', nullable: false })
  created_at: Date;
  
  @Column({ type: 'date', nullable: true })
  ended_at: Date;

  @ManyToOne(()=>User,(user)=>user.activity, {eager:true})
  @JoinColumn({name:'userId'})
  user:User;

  @BeforeInsert()
  onCreate() {
    this.created_at = new Date();
  }
}
