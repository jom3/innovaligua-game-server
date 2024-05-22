import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Word {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type:'text', unique:true, nullable:false})
  word: string;

  @Column({type:'text', nullable:false})
  image: string;
}
