import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeetingLog } from '../entity/meeting-log.entity';

@Injectable()
export class MeetingLogsRepository {
    constructor(
        @InjectRepository(MeetingLog)
        private readonly repo: Repository<MeetingLog>,
    ) {}

    create(payload: Partial<MeetingLog>): MeetingLog {
        return this.repo.create(payload);
    }

    save(meetingLog: MeetingLog): Promise<MeetingLog> {
        return this.repo.save(meetingLog);
    }

    findById(id: string): Promise<MeetingLog | null> {
        return this.repo.findOne({ where: { id } });
    }
}
