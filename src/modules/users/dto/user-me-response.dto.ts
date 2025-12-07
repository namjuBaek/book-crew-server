import { ApiProperty } from '@nestjs/swagger';

class UserDataDto {
    @ApiProperty({
        description: '사용자 아이디',
        example: 'testuser123',
    })
    userId: string;

    @ApiProperty({
        description: '계정 생성일',
        example: '2025-12-07T06:40:51.000Z',
    })
    createdAt: Date;
}

export class UserMeResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '사용자 정보',
        type: UserDataDto,
    })
    data: {
        userId: string;
        createdAt: Date;
    };

    @ApiProperty({
        description: '응답 메시지',
        example: '사용자 정보를 조회했습니다.',
    })
    message: string;
}
