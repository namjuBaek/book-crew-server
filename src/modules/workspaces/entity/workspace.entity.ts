import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { Book } from '../../books/entity/book.entity';
import { MeetingLog } from '../../meetings/entity/meeting-log.entity';

@Entity({ name: 'workspaces' })
export class Workspace {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string | null;

    @Column({ name: 'cover_image', type: 'text', nullable: true })
    coverImage?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    password?: string | null;

    @OneToMany(() => Member, (member) => member.workspace)
    members: Member[];

    @OneToMany(() => Book, (book) => book.workspace)
    books: Book[];

    @OneToMany(() => MeetingLog, (meetingLog) => meetingLog.workspace)
    meetingLogs: MeetingLog[];
}
