import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category, Status } from '../enums';

@Entity()
export class Tracker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 40 })
  title: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  description: string;

  @Column({ type: 'enum', enum: Status, default: Status.TODO })
  status: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(3)',
  })
  created_date: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(3)',
  })
  updated_date: Date;

  @Column({ type: 'enum', enum: Category })
  category: string;

  @Column({ nullable: true, type: 'integer' })
  points: number;

  @Column({ nullable: true, type: 'integer' })
  parentId: number;
}
