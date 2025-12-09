import { ApiProperty } from '@nestjs/swagger';

class CreatedMeetingData {
    @ApiProperty({ description: '미팅 로그 ID', example: '1' })
    id: string;

    @ApiProperty({ description: '모임 제목', example: '1회차 정기 모임' })
    title: string;

    @ApiProperty({ description: '생성 일시', example: '2023-10-01T12:00:00Z' })
    createdAt: Date;
}

export class CreateMeetingResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '데이터',
        type: CreatedMeetingData,
    })
    data: CreatedMeetingData;

    @ApiProperty({
        description: '응답 메시지',
        example: '미팅 문서를 생성했습니다.',
    })
    message: string;
}
