import { ApiProperty } from '@nestjs/swagger';
import { NextMeetingDetailDto } from './get-next-meeting-response.dto';

export class GetLatestMeetingsResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: [NextMeetingDetailDto] })
    data: NextMeetingDetailDto[];

    @ApiProperty({ example: '최근 미팅 목록을 조회했습니다.' })
    message: string;
}
