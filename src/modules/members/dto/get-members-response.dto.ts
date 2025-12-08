import { ApiProperty } from '@nestjs/swagger';

class MemberData {
    @ApiProperty({
        description: '멤버 ID',
        example: '1',
    })
    id: string;

    @ApiProperty({
        description: '멤버 이름',
        example: 'Member Name',
    })
    name: string;

    @ApiProperty({
        description: '역할',
        example: 'MEMBER',
    })
    role: string;

    @ApiProperty({
        description: '참조된 사용자 ID',
        example: '10',
    })
    userId: string;
}

export class GetMembersResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '멤버 목록 데이터',
        type: [MemberData],
    })
    data: MemberData[];

    @ApiProperty({
        description: '페이지네이션 메타데이터',
        example: { totalCount: 100, totalPage: 5, currentPage: 1 },
    })
    meta: {
        totalCount: number;
        totalPage: number;
        currentPage: number;
    };

    @ApiProperty({
        description: '응답 메시지',
        example: '멤버 목록을 조회했습니다.',
    })
    message: string;
}
