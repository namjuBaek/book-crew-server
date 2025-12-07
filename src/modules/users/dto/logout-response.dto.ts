import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '응답 메시지',
        example: '로그아웃되었습니다.',
    })
    message: string;
}
