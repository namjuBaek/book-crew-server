import { Controller } from '@nestjs/common';
import { MeetingsService } from '../service/meetings.service';

@Controller('meetings')
export class MeetingsController {
    constructor(private readonly meetingsService: MeetingsService) {}
}
