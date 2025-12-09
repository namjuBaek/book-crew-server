import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, MoreThanOrEqual, LessThanOrEqual, LessThan } from 'typeorm';
import { MeetingLog } from '../entity/meeting-log.entity';

@Injectable()
export class MeetingLogsRepository {
    constructor(
        @InjectRepository(MeetingLog)
        private readonly repo: Repository<MeetingLog>,
    ) { }

    create(payload: Partial<MeetingLog>): MeetingLog {
        return this.repo.create(payload);
    }

    save(meetingLog: MeetingLog): Promise<MeetingLog> {
        return this.repo.save(meetingLog);
    }

    findById(id: string): Promise<MeetingLog | null> {
        return this.repo.findOne({ where: { id } });
    }

    findNextMeeting(workspaceId: string, today: string): Promise<MeetingLog | null> {
        return this.repo.findOne({
            where: {
                workspaceId,
                meetingDate: MoreThanOrEqual(today),
            },
            relations: ['book', 'attendees'],
            order: { meetingDate: 'ASC', createdAt: 'ASC' },
        });
    }

    findLatestMeetings(workspaceId: string, today: string): Promise<MeetingLog[]> {
        return this.repo.find({
            where: {
                workspaceId,
                meetingDate: LessThan(today),
            },
            relations: ['book', 'attendees'],
            order: { meetingDate: 'DESC', createdAt: 'DESC' },
            take: 3,
        });
    }

    countByWorkspaceId(workspaceId: string): Promise<number> {
        return this.repo.count({ where: { workspaceId } });
    }

    findByWorkspaceId(
        workspaceId: string,
        page: number,
        limit: number,
        keyword?: string,
        startDate?: string,
        endDate?: string,
    ): Promise<[MeetingLog[], number]> {
        const where: any = { workspaceId };

        if (keyword) {
            where.title = Like(`%${keyword}%`);
        }

        if (startDate && endDate) {
            where.meetingDate = Between(startDate, endDate);
        } else if (startDate) {
            where.meetingDate = MoreThanOrEqual(startDate);
        } else if (endDate) {
            where.meetingDate = LessThanOrEqual(endDate);
        }

        return this.repo.findAndCount({
            where,
            relations: ['book', 'attendees'],
            order: { meetingDate: 'DESC', createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    findDetailById(id: string): Promise<MeetingLog | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['book', 'attendees', 'attendees.member', 'attendees.member.user'],
        });
    }
}
