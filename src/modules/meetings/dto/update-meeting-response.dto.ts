import { ApiProperty } from '@nestjs/swagger';

class UpdatedMeetingData {
    @ApiProperty({ description: '미팅 로그 ID', example: '1' })
    id: string;

    @ApiProperty({ description: '모임 제목', example: '1회차 정기 모임' })
    title: string;
}

export class UpdateMeetingResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '데이터',
        type: UpdatedMeetingData,
    })
    data: UpdatedMeetingData;

    @ApiProperty({
        description: '응답 메시지',
        example: '미팅 정보를 수정했습니다.',
    })
    message: string;
}
