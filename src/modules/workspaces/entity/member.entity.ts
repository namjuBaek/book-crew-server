import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Workspace } from './workspace.entity';
import { Book } from '../../books/entity/book.entity';
import { Attendee } from '../../meetings/entity/attendee.entity';

@Index('members_user_id_idx', ['userId'])
@Index('members_workspace_id_idx', ['workspaceId'])
@Unique('members_user_workspace_unique', ['userId', 'workspaceId'])
@Entity({ name: 'members' })
export class Member {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Column({ name: 'user_id', type: 'bigint', unsigned: true })
    userId: string;

    @Column({ name: 'workspace_id', type: 'bigint', unsigned: true })
    workspaceId: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 20, default: 'MEMBER' })
    role: string;

    @ManyToOne(() => User, (user) => user.members, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Workspace, (workspace) => workspace.members, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'workspace_id' })
    workspace: Workspace;

    @OneToMany(() => Book, (book) => book.createdBy)
    books: Book[];

    @OneToMany(() => Attendee, (attendee) => attendee.member)
    attendees: Attendee[];
}
