import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from '../../workspaces/entity/workspace.entity';
import { Book } from '../../books/entity/book.entity';
import { Attendee } from './attendee.entity';

@Index('meeting_logs_workspace_id_idx', ['workspaceId'])
@Index('meeting_logs_book_id_idx', ['bookId'])
@Entity({ name: 'meeting_logs' })
export class MeetingLog {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Column({ name: 'workspace_id', type: 'bigint', unsigned: true })
    workspaceId: string;

    @Column({ name: 'book_id', type: 'bigint', unsigned: true, nullable: true })
    bookId?: string | null;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @ManyToOne(() => Workspace, (workspace) => workspace.meetingLogs, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'workspace_id' })
    workspace: Workspace;

    @ManyToOne(() => Book, (book) => book.meetingLogs, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn({ name: 'book_id' })
    book?: Book | null;

    @OneToMany(() => Attendee, (attendee) => attendee.meetingLog)
    attendees: Attendee[];
}
