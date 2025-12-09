import { ApiProperty } from '@nestjs/swagger';

class AttendeeDetail {
    @ApiProperty({ description: '참석자 기록 ID', example: '1' })
    id: string;

    @ApiProperty({ description: '멤버 ID', example: '11' })
    memberId: string;

    @ApiProperty({ description: '이름', example: '홍길동' })
    name: string;

    @ApiProperty({ description: '역할', example: 'MEMBER' })
    role: string;

    @ApiProperty({ description: '사용자 ID', example: 'user123' })
    userId: string;

    @ApiProperty({ description: '노트', example: '오늘 모임은...', nullable: true })
    note?: string | null;
}

class MeetingDetailData {
    @ApiProperty({ description: '미팅 로그 ID', example: '1' })
    id: string;

    @ApiProperty({ description: '제목', example: '1회차 정기 모임' })
    title: string;

    @ApiProperty({ description: '모임 날짜', example: '2023-10-01' })
    meetingDate: string;

    @ApiProperty({ description: '생성 일시', example: '2023-10-01T12:00:00Z' })
    createdAt: Date;

    @ApiProperty({ description: '책 ID', example: '1', nullable: true })
    bookId?: string | null;

    @ApiProperty({ description: '책 제목', example: '데이터 중심 애플리케이션 설계', nullable: true })
    bookTitle?: string | null;

    @ApiProperty({ description: '참석자 목록', type: [AttendeeDetail] })
    attendees: AttendeeDetail[];
}

export class GetMeetingDetailResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '미팅 상세 데이터',
        type: MeetingDetailData,
    })
    data: MeetingDetailData;

    @ApiProperty({
        description: '응답 메시지',
        example: '미팅 상세 정보를 조회했습니다.',
    })
    message: string;
}
