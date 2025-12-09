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
import { Member } from '../../workspaces/entity/member.entity';
import { MeetingLog } from '../../meetings/entity/meeting-log.entity';

@Index('books_workspace_id_idx', ['workspaceId'])
@Index('books_created_by_id_idx', ['createdById'])
@Entity({ name: 'books' })
export class Book {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;

    @Column({ name: 'workspace_id', type: 'bigint', unsigned: true })
    workspaceId: string;

    @Column({ name: 'created_by_id', type: 'bigint', unsigned: true })
    createdById: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @ManyToOne(() => Workspace, (workspace) => workspace.books, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'workspace_id' })
    workspace: Workspace;

    @ManyToOne(() => Member, (member) => member.books, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'created_by_id' })
    createdBy: Member;

    @OneToMany(() => MeetingLog, (meetingLog) => meetingLog.book)
    meetingLogs: MeetingLog[];
}
