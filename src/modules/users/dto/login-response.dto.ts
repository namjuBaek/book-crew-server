import { ApiProperty } from '@nestjs/swagger';

class LoginDataDto {
    @ApiProperty({
        description: '사용자 아이디',
        example: 'testuser123',
    })
    userId: string;

    @ApiProperty({
        description: 'JWT 액세스 토큰',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    accessToken: string;

    @ApiProperty({
        description: 'JWT 리프레시 토큰 (자동 로그인 시에만 제공)',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        required: false,
    })
    refreshToken?: string;
}

export class LoginResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '로그인 데이터',
        type: LoginDataDto,
    })
    data: {
        userId: string;
        accessToken: string;
        refreshToken?: string;
    };

    @ApiProperty({
        description: '응답 메시지',
        example: '로그인에 성공했습니다.',
    })
    message: string;
}
