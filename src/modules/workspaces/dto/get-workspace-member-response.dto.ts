import { ApiProperty } from '@nestjs/swagger';

class WorkspaceMemberData {
    @ApiProperty({
        description: '멤버 ID',
        example: '1',
    })
    id: string;

    @ApiProperty({
        description: '멤버 이름',
        example: 'HongGilDong',
    })
    name: string;

    @ApiProperty({
        description: '역할',
        example: 'ADMIN',
    })
    role: string;

    @ApiProperty({
        description: '사용자 ID',
        example: '10',
    })
    userId: string;
}

export class GetWorkspaceMemberResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '워크스페이스 멤버 정보',
        type: WorkspaceMemberData,
    })
    data: WorkspaceMemberData;

    @ApiProperty({
        description: '응답 메시지',
        example: '멤버 정보를 조회했습니다.',
    })
    message: string;
}
