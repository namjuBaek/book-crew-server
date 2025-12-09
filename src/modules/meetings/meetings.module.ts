import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingsController } from './controller/meetings.controller';
import { MeetingsService } from './service/meetings.service';
import { MeetingLogsRepository } from './repository/meeting-logs.repository';
import { AttendeesRepository } from './repository/attendees.repository';
import { MeetingLog } from './entity/meeting-log.entity';
import { Attendee } from './entity/attendee.entity';

import { MembersModule } from '../members/members.module';

@Module({
    imports: [TypeOrmModule.forFeature([MeetingLog, Attendee]), MembersModule],
    controllers: [MeetingsController],
    providers: [MeetingsService, MeetingLogsRepository, AttendeesRepository],
    exports: [TypeOrmModule, MeetingsService, MeetingLogsRepository, AttendeesRepository],
})
export class MeetingsModule { }
