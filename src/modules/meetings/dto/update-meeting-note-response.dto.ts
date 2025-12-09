import { ApiProperty } from '@nestjs/swagger';

class UpdatedNoteData {
    @ApiProperty({ description: '참석자 ID', example: '3' })
    attendeeId: string;

    @ApiProperty({ description: '수정된 노트', example: 'Updated note...' })
    note: string;
}

export class UpdateMeetingNoteResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '데이터',
        type: UpdatedNoteData,
    })
    data: UpdatedNoteData;

    @ApiProperty({
        description: '응답 메시지',
        example: '노트를 수정했습니다.',
    })
    message: string;
}
