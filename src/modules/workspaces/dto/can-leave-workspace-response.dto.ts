import { ApiProperty } from '@nestjs/swagger';

class CanLeaveData {
    @ApiProperty({
        description: '나가기 가능 여부',
        example: true,
    })
    canLeave: boolean;
}

export class CanLeaveWorkspaceResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '데이터',
        type: CanLeaveData,
    })
    data: CanLeaveData;

    @ApiProperty({
        description: '응답 메시지',
        example: '나가기 가능 여부를 확인했습니다.',
    })
    message: string;
}
