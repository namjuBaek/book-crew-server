import { ApiProperty } from '@nestjs/swagger';

class MemberSimpleData {
    @ApiProperty({ description: '멤버 ID', example: '1' })
    id: string;

    @ApiProperty({ description: '이름', example: '홍길동' })
    name: string;

    @ApiProperty({ description: '역할', example: 'MEMBER' })
    role: string;

    @ApiProperty({ description: '사용자 ID', example: 'user123' })
    userId: string;
}

export class SearchMemberResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '검색된 멤버 목록',
        type: [MemberSimpleData],
    })
    data: MemberSimpleData[];

    @ApiProperty({
        description: '응답 메시지',
        example: '멤버를 검색했습니다.',
    })
    message: string;
}
