import { ApiProperty } from '@nestjs/swagger';

export class NextMeetingDetailDto {
    @ApiProperty({ example: '1' })
    id: string;

    @ApiProperty({ example: '정기 모임' })
    title: string;

    @ApiProperty({ example: '2023-10-25' })
    meetingDate: string;

    @ApiProperty({ example: '2023-10-01T12:00:00Z' })
    createdAt: Date;

    @ApiProperty({ example: '1', nullable: true })
    bookId?: string | null;

    @ApiProperty({ example: 'Clean Code', nullable: true })
    bookTitle?: string | null;

    @ApiProperty({ example: 5 })
    attendeeCount: number;
}

export class GetNextMeetingResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: NextMeetingDetailDto, nullable: true })
    data?: NextMeetingDetailDto | null;

    @ApiProperty({ example: '다음 미팅 정보를 조회했습니다.' })
    message: string;
}
