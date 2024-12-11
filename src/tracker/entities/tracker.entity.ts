import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Tracker {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 40 })
    title: string;

    @Column({ type: 'varchar', length: 500, default: '' })
    description: string;

    @Column({ type: 'enum', enum: ['t', 'p', 'i', 'd'], default: 't' })
    /**
     * t - TODO
     * p - IN_PROGRESS
     * i - IN_REVIEW
     * d - DONE
     */
    status: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(3)' })
    created_date: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(3)' })
    updated_date: Date;

    @Column({ type: 'enum', enum: ['e', 's', 't'] })
    /**
     * e - Epic
     * s - Story
     * t - Subtask
     */
    category: string;

    @Column({ nullable: true, type: 'integer' })
    points: number;

    @Column({nullable: true, type: 'integer'})
    parentId: number
}
