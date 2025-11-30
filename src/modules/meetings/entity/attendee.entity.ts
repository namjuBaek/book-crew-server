import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { MeetingLog } from './meeting-log.entity';
import { Member } from '../../workspaces/entity/member.entity';

@Index('attendees_meeting_log_id_idx', ['meetingLogId'])
@Index('attendees_member_id_idx', ['memberId'])
@Unique('attendees_meeting_log_member_unique', ['meetingLogId', 'memberId'])
@Entity({ name: 'attendees' })
export class Attendee {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Column({ name: 'meeting_log_id', type: 'bigint', unsigned: true })
    meetingLogId: string;

    @Column({ name: 'member_id', type: 'bigint', unsigned: true })
    memberId: string;

    @Column({ type: 'text', nullable: true })
    memo?: string | null;

    @ManyToOne(() => MeetingLog, (meetingLog) => meetingLog.attendees, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'meeting_log_id' })
    meetingLog: MeetingLog;

    @ManyToOne(() => Member, (member) => member.attendees, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'member_id' })
    member: Member;
}
