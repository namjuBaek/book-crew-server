import { ApiProperty } from '@nestjs/swagger';

export class JoinWorkspaceResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '응답 데이터',
        example: {},
    })
    data: object;

    @ApiProperty({
        description: '응답 메시지',
        example: '워크스페이스에 참여했습니다.',
    })
    message: string;
}
