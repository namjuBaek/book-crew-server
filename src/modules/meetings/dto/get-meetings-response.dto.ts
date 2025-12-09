import { ApiProperty } from '@nestjs/swagger';

class MeetingLogData {
    @ApiProperty({ description: '미팅 로그 ID', example: '1' })
    id: string;

    @ApiProperty({ description: '제목', example: '1회차 정기 모임' })
    title: string;

    @ApiProperty({ description: '모임 날짜', example: '2023-10-01' })
    meetingDate: string;

    @ApiProperty({ description: '생성 일시', example: '2023-10-01T12:00:00Z' })
    createdAt: Date;

    @ApiProperty({ description: '책 제목 (없으면 null)', example: '데이터 중심 애플리케이션 설계', nullable: true })
    bookTitle?: string | null;

    @ApiProperty({ description: '참석자 수', example: 5 })
    attendeeCount: number;
}

class PaginationMeta {
    @ApiProperty({ description: '현재 페이지', example: 1 })
    page: number;

    @ApiProperty({ description: '전체 아이템 수', example: 20 })
    totalCount: number;

    @ApiProperty({ description: '전체 페이지 수', example: 2 })
    totalPage: number;
}

export class GetMeetingsResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '미팅 목록 데이터',
        type: [MeetingLogData],
    })
    data: MeetingLogData[];

    @ApiProperty({
        description: '페이지네이션 메타데이터',
        type: PaginationMeta,
    })
    meta: PaginationMeta;

    @ApiProperty({
        description: '응답 메시지',
        example: '미팅 목록을 조회했습니다.',
    })
    message: string;
}
