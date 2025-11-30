import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendee } from '../entity/attendee.entity';

@Injectable()
export class AttendeesRepository {
    constructor(
        @InjectRepository(Attendee)
        private readonly repo: Repository<Attendee>,
    ) {}

    create(payload: Partial<Attendee>): Attendee {
        return this.repo.create(payload);
    }

    save(attendee: Attendee): Promise<Attendee> {
        return this.repo.save(attendee);
    }

    findByMeetingAndMember(meetingLogId: string, memberId: string): Promise<Attendee | null> {
        return this.repo.findOne({ where: { meetingLogId, memberId } });
    }
}
