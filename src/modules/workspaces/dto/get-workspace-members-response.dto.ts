import { ApiProperty } from '@nestjs/swagger';

class WorkspaceMemberData {
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
        description: '사용자 ID',
        example: '10',
    })
    userId: string;
}

export class GetWorkspaceMembersResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '멤버 목록 데이터',
        type: [WorkspaceMemberData],
    })
    data: WorkspaceMemberData[];

    @ApiProperty({
        description: '응답 메시지',
        example: '워크스페이스 멤버 목록을 조회했습니다.',
    })
    message: string;
}
