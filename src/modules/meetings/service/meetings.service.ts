import { Injectable } from '@nestjs/common';
import { MeetingLogsRepository } from '../repository/meeting-logs.repository';
import { AttendeesRepository } from '../repository/attendees.repository';
import { MeetingLog } from '../entity/meeting-log.entity';
import { Attendee } from '../entity/attendee.entity';

@Injectable()
export class MeetingsService {
    constructor(
        private readonly meetingLogsRepository: MeetingLogsRepository,
        private readonly attendeesRepository: AttendeesRepository,
    ) {}

    createMeetingLog(data: Partial<MeetingLog>): Promise<MeetingLog> {
        const meetingLog = this.meetingLogsRepository.create(data);
        return this.meetingLogsRepository.save(meetingLog);
    }

    addAttendee(data: Partial<Attendee>): Promise<Attendee> {
        const attendee = this.attendeesRepository.create(data);
        return this.attendeesRepository.save(attendee);
    }
}
