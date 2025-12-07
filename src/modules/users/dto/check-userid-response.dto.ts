import { ApiProperty } from '@nestjs/swagger';

class CheckUserIdDataDto {
    @ApiProperty({
        description: '아이디 사용 가능 여부',
        example: true,
    })
    available: boolean;

    @ApiProperty({
        description: '확인한 아이디',
        example: 'testuser123',
        required: false,
    })
    userId?: string;
}

export class CheckUserIdResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '응답 데이터',
        type: CheckUserIdDataDto,
    })
    data: {
        available: boolean;
        userId?: string;
    };

    @ApiProperty({
        description: '응답 메시지',
        example: '사용 가능한 아이디입니다.',
    })
    message: string;
}
